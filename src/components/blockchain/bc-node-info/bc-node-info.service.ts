import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { PaginateModel, PaginateResult } from 'mongoose';
import { BC_NODE_INFO_CONSTANT } from 'src/@core/constants/api-error-constants/bc-node-info-constant';
import { getSearchFilterWithRegexAll } from 'src/@core/utils/query-filter.utils';
import { BcConnectionService } from '../bc-connection/bc-connection.service';
import { BcUserAuthenticationDto } from '../dto/bc-user-authentication.dto';
import { CreateBcNodeInfoDto } from './dto/create-bc-node-info.dto';
import { IBcNodeInfo } from './interfaces/bc-node-info.interface';

@Injectable()
export class BcNodeInfoService {
    constructor(@InjectModel('BcNodeInfo') private readonly bcNodeInfoModel: PaginateModel<IBcNodeInfo>, private readonly bcConnectionService: BcConnectionService) {}

    async addBcNodeInfo(createBcNodeInfoDto: CreateBcNodeInfoDto, req: Request): Promise<IBcNodeInfo> {
        const user = req['user']._id;
        // Static key and salt fetched from Env file. Needs to load dynamically from user details later.
        const key = process.env.KEY;
        const salt = process.env.SALT;
        const connectionValid = await this.checkValidBcNodeInfo(createBcNodeInfoDto, new BcUserAuthenticationDto(key, salt));
        if (!connectionValid) throw new BadRequestException([BC_NODE_INFO_CONSTANT.INCORRECT_BC_NODE_INFO]);

        const bcNodeInfoExists = await this.checkBcNodeInfoExists(createBcNodeInfoDto.orgName);
        if (bcNodeInfoExists) {
            throw new ConflictException([BC_NODE_INFO_CONSTANT.BC_NODE_INFO_ALREADY_EXISTS]);
        }
        const bcNodeInfo = new this.bcNodeInfoModel(createBcNodeInfoDto);
        bcNodeInfo.addedBy = user;
        return await bcNodeInfo.save();
    }

    async getBcNodeInfoById(id: string): Promise<IBcNodeInfo> {
        const bcNodeInfo = await this.bcNodeInfoModel.findOne({ _id: id, status: true });
        if (!bcNodeInfo) throw new NotFoundException([BC_NODE_INFO_CONSTANT.BC_NODE_INFO_NOT_FOUND]);

        return bcNodeInfo;
    }

    async getAllBcNodeInfo(req: Request): Promise<PaginateResult<IBcNodeInfo>> {
        const { page = 1, limit = 10, status = true, search, searchValue } = req.query;
        const searchQuery = search && search === 'true' && searchValue ? getSearchFilterWithRegexAll(searchValue.toString(), ['orgName', 'nodeUrl']) : {};
        const options = {
            populate: [{ path: 'addedBy', select: 'firstName lastName email' }],
            lean: true,
            limit: Number(limit),
            page: Number(page),
            sort: { updatedAt: -1 }
        };
        return await this.bcNodeInfoModel.paginate({ status, ...searchQuery }, options);
    }

    async updateBcNodeInfo(id: string, updateBcNodeInfoDto: CreateBcNodeInfoDto): Promise<IBcNodeInfo> {
        // Static key and salt fetched from Env file. Needs to load dynamically from user details later.
        const key = process.env.KEY;
        const salt = process.env.SALT;

        const connectionValid = await this.checkValidBcNodeInfo(updateBcNodeInfoDto, new BcUserAuthenticationDto(key, salt));
        if (!connectionValid) throw new BadRequestException([BC_NODE_INFO_CONSTANT.INCORRECT_BC_NODE_INFO]);

        const bcNodeInfo = await this.getBcNodeInfoById(id);
        if (!bcNodeInfo) throw new NotFoundException([BC_NODE_INFO_CONSTANT.BC_NODE_INFO_NOT_FOUND]);

        const bcNodeInfoExists = await this.checkBcNodeInfoExists(updateBcNodeInfoDto.orgName);
        if (bcNodeInfoExists && updateBcNodeInfoDto.orgName != bcNodeInfo.orgName) {
            throw new ConflictException([BC_NODE_INFO_CONSTANT.BC_NODE_INFO_ALREADY_EXISTS]);
        }
        return await this.bcNodeInfoModel.findOneAndUpdate({ _id: id }, updateBcNodeInfoDto, { new: true });
    }

    async deleteBcNodeInfo(id: string): Promise<IBcNodeInfo> {
        const bcNodeInfo = await this.getBcNodeInfoById(id);
        if (!bcNodeInfo) throw new NotFoundException([BC_NODE_INFO_CONSTANT.BC_NODE_INFO_NOT_FOUND]);
        return await this.bcNodeInfoModel.findOneAndUpdate({ _id: id }, { status: false }, { new: true });
    }

    private async checkBcNodeInfoExists(orgName: string): Promise<boolean> {
        const bcNodeInfoResponse = await this.bcNodeInfoModel.findOne({ orgName: orgName, status: true });
        if (bcNodeInfoResponse) return true;
        return false;
    }

    private async checkValidBcNodeInfo(bcNodeInfo: CreateBcNodeInfoDto, bcUserAuthenticationDto: BcUserAuthenticationDto): Promise<boolean> {
        try {
            await this.bcConnectionService.checkBcNodeConnection(bcNodeInfo, bcUserAuthenticationDto);
            return true;
        } catch (err) {
            return false;
        }
    }
}

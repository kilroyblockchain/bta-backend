import { BadRequestException, ConflictException, forwardRef, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { PaginateModel, PaginateResult } from 'mongoose';
import { BC_NODE_INFO_CONSTANT } from 'src/@core/constants/api-error-constants/bc-node-info-constant';
import { getSearchFilterWithRegexAll } from 'src/@core/utils/query-filter.utils';
import { OrganizationStaffingService } from 'src/components/app-user/user-roles/organization-staffing/organization-staffing.service';
import { RegisterBcUserDto } from 'src/components/app-user/user/dto/register-bc-user.dto';
import { UserService } from 'src/components/app-user/user/user.service';
import { BcConnectionService } from '../bc-connection/bc-connection.service';
import { CreateBcNodeInfoDto } from './dto/create-bc-node-info.dto';
import { IBcNodeInfo } from './interfaces/bc-node-info.interface';

@Injectable()
export class BcNodeInfoService {
    constructor(
        @InjectModel('BcNodeInfo') private readonly bcNodeInfoModel: PaginateModel<IBcNodeInfo>,
        private readonly bcConnectionService: BcConnectionService,
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        private readonly organizationStaffingService: OrganizationStaffingService
    ) {}

    async addBcNodeInfo(createBcNodeInfoDto: CreateBcNodeInfoDto, req: Request): Promise<IBcNodeInfo> {
        try {
            const userId = req['user']._id;
            const userEmail = await this.userService.getUserEmail(userId);

            const connectionValid = await this.checkValidBcNodeInfo(createBcNodeInfoDto);
            if (!connectionValid) throw new BadRequestException([BC_NODE_INFO_CONSTANT.INCORRECT_BC_NODE_INFO]);

            const bcNodeInfoExists = await this.checkBcNodeInfoExists(createBcNodeInfoDto.orgName);
            if (bcNodeInfoExists) {
                throw new ConflictException([BC_NODE_INFO_CONSTANT.BC_NODE_INFO_ALREADY_EXISTS]);
            }
            const bcNodeInfo = new this.bcNodeInfoModel(createBcNodeInfoDto);
            bcNodeInfo.addedBy = userId;

            const bcNodeInfoSaved = await bcNodeInfo.save();
            await this.bcConnectionService.registerSuperAdminUser(new RegisterBcUserDto(userId, userEmail['email']), bcNodeInfoSaved);

            return bcNodeInfoSaved;
        } catch (err) {
            if (err.statusCode !== HttpStatus.CONFLICT) {
                throw err;
            }
        }
    }

    async getBcNodeInfoById(id: string, status = true): Promise<IBcNodeInfo> {
        const bcNodeInfo = await this.bcNodeInfoModel.findOne({ _id: id, status });
        if (!bcNodeInfo) throw new NotFoundException([BC_NODE_INFO_CONSTANT.BC_NODE_INFO_NOT_FOUND]);

        return bcNodeInfo;
    }

    async getAllBcNodeInfo(req?: Request): Promise<PaginateResult<IBcNodeInfo>> {
        let page;
        let limit;
        let status;
        let search = null;
        let searchValue = null;

        if (req) {
            ({ page = 1, limit = 10, status = true, search, searchValue } = req.query);
        } else {
            page = 1;
            limit = 10;
            status = true;
        }
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
        try {
            const connectionValid = await this.checkValidBcNodeInfo(updateBcNodeInfoDto);
            if (!connectionValid) throw new BadRequestException([BC_NODE_INFO_CONSTANT.INCORRECT_BC_NODE_INFO]);

            const bcNodeInfo = await this.getBcNodeInfoById(id);
            if (!bcNodeInfo) throw new NotFoundException([BC_NODE_INFO_CONSTANT.BC_NODE_INFO_NOT_FOUND]);

            const bcNodeInfoExists = await this.checkBcNodeInfoExists(updateBcNodeInfoDto.orgName);
            if (bcNodeInfoExists && updateBcNodeInfoDto.orgName != bcNodeInfo.orgName) {
                throw new ConflictException([BC_NODE_INFO_CONSTANT.BC_NODE_INFO_ALREADY_EXISTS]);
            }
            return await this.bcNodeInfoModel.findOneAndUpdate({ _id: id }, updateBcNodeInfoDto, { new: true });
        } catch (err) {
            throw err;
        }
    }

    async deleteBcNodeInfo(id: string): Promise<IBcNodeInfo> {
        const bcNodeInfo = await this.getBcNodeInfoById(id);

        if (!bcNodeInfo) throw new NotFoundException([BC_NODE_INFO_CONSTANT.BC_NODE_INFO_NOT_FOUND]);

        const isBcNodeInfoUsedInStaffing = await this.organizationStaffingService.checkBcNodeUsedInStaffing(bcNodeInfo._id);
        if (isBcNodeInfoUsedInStaffing) throw new BadRequestException([BC_NODE_INFO_CONSTANT.UNABLE_TO_DELETE_BC_NODE_INFO]);

        return await this.bcNodeInfoModel.findOneAndUpdate({ _id: id }, { status: false }, { new: true });
    }

    async enableBcNodeInfo(id: string): Promise<IBcNodeInfo> {
        const bcNodeInfo = await this.getBcNodeInfoById(id, false);
        if (!bcNodeInfo) throw new NotFoundException([BC_NODE_INFO_CONSTANT.BC_NODE_INFO_NOT_FOUND]);

        return await this.bcNodeInfoModel.findOneAndUpdate({ _id: id }, { status: true }, { new: true });
    }

    private async checkBcNodeInfoExists(orgName: string): Promise<boolean> {
        const bcNodeInfoResponse = await this.bcNodeInfoModel.findOne({ orgName: orgName, status: true });
        if (bcNodeInfoResponse) return true;
        return false;
    }

    private async checkValidBcNodeInfo(bcNodeInfo: CreateBcNodeInfoDto): Promise<boolean> {
        try {
            await this.bcConnectionService.checkBcNodeConnection(bcNodeInfo);
            return true;
        } catch (err) {
            return false;
        }
    }
}

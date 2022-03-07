import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { PaginateModel, PaginateResult } from 'mongoose';
import { EducationDto } from './dto/education.dto';
import { IEducation } from './interface/education.interface';
import { EDUCATION_CONSTANT } from 'src/@core/constants/api-error-constants';
import { getSearchFilter, getSearchFilterWithRegex } from 'src/@core/utils/query-filter.utils';
import { UserService } from '../../user/user.service';
import { BC_STATUS } from 'src/@core/constants/bc-status.enum';
import { EducationBcService } from './education-bc.service';
import { BC_PAYLOAD } from 'src/@core/constants/bc-constants/bc-payload.constant';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { BcUserDto } from 'src/@core/common/bc-user.dto';

@Injectable()
export class EducationService {
    constructor(
        @InjectModel('education')
        private readonly EducationModel: PaginateModel<IEducation>,
        private userService: UserService,
        private educationBcService: EducationBcService
    ) {}

    async createEducation(newEducationDto: EducationDto, req: Request): Promise<IEducation> {
        newEducationDto['userId'] = req['user']._id;
        const newEducation = new this.EducationModel(newEducationDto);
        const education = await newEducation.save();
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.educationBcService.storeEducationBC(education, bcUserDto, BC_PAYLOAD.CREATE_EDUCATION);
        }
        const userEmail = req['user'].email;
        const userEducation: [string] = req['user'].education ? req['user'].education : [];
        userEducation.push(education._id);
        return this.userService.addEducation({ education: userEducation, email: userEmail }, req);
    }

    async findEducationById(id: string): Promise<IEducation> {
        const education = await this.EducationModel.findById(id);
        if (!education) {
            throw new NotFoundException(EDUCATION_CONSTANT.EDUCATION_NOT_FOUND);
        }
        return education;
    }

    async findAllEducation(req: Request): Promise<PaginateResult<IEducation> | { docs: IEducation[] }> {
        const userId = req['user']._id;
        const { page, limit, search } = req.query;
        if (!page || !limit) {
            const educationResult = await this.EducationModel.find({
                userId,
                status: true
            });
            return { docs: educationResult };
        }
        let query: any = { userId, status: true };
        if (search) {
            const filterForStringField = getSearchFilterWithRegex(req.query, ['school', 'degree', 'fieldOfStudy', 'grade']);
            const filterForNonStringField = getSearchFilter(req.query, ['userId', 'startYear', 'endYear', 'status']);
            query = { ...filterForStringField, ...filterForNonStringField };
        }
        const options = {
            page: Number(page),
            limit: Number(limit)
        };
        const educationData = await this.EducationModel.paginate(query, options);
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            educationData.docs = await this.educationBcService.getBlockchainVerifiedList(educationData.docs, bcUserDto);
        }
        return educationData;
    }

    async updateEducation(id: string, updateEducationDto: EducationDto, req: Request): Promise<any> {
        const userId = req['user']._id;
        const education = await this.findEducationById(id);
        await education.update(updateEducationDto);
        const educationUpdated = await this.userService.findUserWithPopulatedFields(userId, 'education');
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const education = await this.findEducationById(id);
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.educationBcService.storeEducationBC(education, bcUserDto, BC_PAYLOAD.UPDATE_EDUCATION);
        }
        return educationUpdated;
    }

    async deleteEducation(id: string, req: Request): Promise<IEducation> {
        const userEmail = req['user'].email;
        const education = await this.findEducationById(id);
        await education.update({ status: false });
        const educationUpdated = await this.userService.removeEducation({ email: userEmail, educationId: id }, req);
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const education = await this.findEducationById(id);
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.educationBcService.storeEducationBC(education, bcUserDto, BC_PAYLOAD.UPDATE_EDUCATION);
        }
        return educationUpdated;
    }

    /**
     * Find Education Blockchain History
     * Calls getEducationBcHistory function of education blockchain service. If education not found, throws an error.
     *
     *
     * @param {Request} options - Option of type Request
     * @param {string} educationId - Id of the education to get the history from blockchain
     *
     *
     **/
    async findEducationBlockchainHistory(options: Request, educationId: string): Promise<any> {
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = options['user']._id;
            bcUserDto.company = options['user'].company.find((defaultCompany) => defaultCompany.default);
            const blockchainHistory = await this.educationBcService.getEducationBcHistory(bcUserDto, educationId);
            if (blockchainHistory.length == 0) {
                throw new NotFoundException(BC_ERROR_RESPONSE.BLOCKCHAIN_HISTORY_NOT_FOUND);
            }
            const educationData = await this.findEducationById(educationId);
            return {
                blockchainHistory,
                educationData
            };
        } else {
            throw new BadRequestException(BC_ERROR_RESPONSE.BLOCKCHAIN_NOT_ENABLED);
        }
    }
}

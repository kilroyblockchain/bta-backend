import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { PaginateModel, PaginateResult } from 'mongoose';
import { getSearchFilter, getSearchFilterWithRegex } from 'src/@core/utils/query-filter.utils';
import { ExperienceDto } from './dto/experience.dto';
import { IExperience } from './interface/experience.interface';
import { EXPERIENCE_CONSTANT } from 'src/@core/constants/api-error-constants';
import { UserService } from '../../user/user.service';
import { BC_STATUS } from 'src/@core/constants/bc-status.enum';
import { BC_PAYLOAD } from 'src/@core/constants/bc-constants/bc-payload.constant';
import { ExperienceBcService } from './experience-bc.service';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { BcUserDto } from 'src/@core/common/bc-user.dto';

@Injectable()
export class ExperienceService {
    constructor(
        @InjectModel('experience')
        private readonly ExperienceModel: PaginateModel<IExperience>,
        private userService: UserService,
        private readonly experienceBcService: ExperienceBcService
    ) {}

    async createExperience(newExperienceDto: ExperienceDto, req: Request): Promise<IExperience> {
        newExperienceDto['userId'] = req['user']._id;
        const newExperience = new this.ExperienceModel(newExperienceDto);
        const experience = await newExperience.save();
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.experienceBcService.storeExperienceBC(experience, bcUserDto, BC_PAYLOAD.CREATE_EXPERIENCE);
        }
        const userEmail = req['user'].email;
        const userExperience: [string] = req['user'].experience ? req['user'].experience : [];
        userExperience.push(experience._id);
        return this.userService.addExperience({ experience: userExperience, email: userEmail }, req);
    }

    async findExperienceById(id: string): Promise<IExperience> {
        const experience = await this.ExperienceModel.findById(id);
        if (!experience) {
            throw new NotFoundException(EXPERIENCE_CONSTANT.EXPERIENCE_NOT_FOUND);
        }
        return experience;
    }

    async findAllExperience(req: Request): Promise<PaginateResult<IExperience> | { docs: IExperience[] }> {
        const userId = req['user']._id;
        const { page, limit, search } = req.query;
        if (!page || !limit) {
            const experienceResult = await this.ExperienceModel.find({
                userId,
                status: true
            });
            return { docs: experienceResult };
        }
        let query: any = { userId, status: true };
        if (search) {
            const filterForStringField = getSearchFilterWithRegex(req.query, ['title', 'employmentType', 'company', 'location']);
            const filterForNonStringField = getSearchFilter(req.query, ['userId', 'startDate', 'endDate', 'status']);
            query = { ...filterForStringField, ...filterForNonStringField };
        }
        const options = {
            page: Number(page),
            limit: Number(limit)
        };
        const experienceData = await this.ExperienceModel.paginate(query, options);
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            experienceData.docs = await this.experienceBcService.getBlockchainVerifiedList(experienceData.docs, bcUserDto);
        }
        return experienceData;
    }

    async updateExperience(id: string, updateExperienceDto: ExperienceDto, req: Request): Promise<any> {
        const userId = req['user']._id;
        const experience = await this.findExperienceById(id);
        await experience.update(updateExperienceDto);
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const experience = await this.findExperienceById(id);
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.experienceBcService.storeExperienceBC(experience, bcUserDto, BC_PAYLOAD.UPDATE_EXPERIENCE);
        }
        return await this.userService.findUserWithPopulatedFields(userId, 'experience');
    }

    async deleteExperience(id: string, req: Request): Promise<IExperience> {
        const userEmail = req['user'].email;
        const experience = await this.findExperienceById(id);
        await experience.update({ status: false });
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const experience = await this.findExperienceById(id);
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.experienceBcService.storeExperienceBC(experience, bcUserDto, BC_PAYLOAD.DELETE_EXPERIENCE);
        }
        return await this.userService.removeExperience({ email: userEmail, experienceId: id }, req);
    }

    async findExperienceBlockchainHistory(req: Request, experienceId: string): Promise<any> {
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            const blockchainHistory = await this.experienceBcService.getExperienceBlockchainHistory(bcUserDto, experienceId);
            if (blockchainHistory.length == 0) {
                throw new NotFoundException(BC_ERROR_RESPONSE.BLOCKCHAIN_HISTORY_NOT_FOUND);
            }
            const experience = await this.findExperienceById(experienceId);
            return {
                blockchainHistory,
                experience
            };
        } else {
            throw new BadRequestException(BC_ERROR_RESPONSE.BLOCKCHAIN_NOT_ENABLED);
        }
    }
}

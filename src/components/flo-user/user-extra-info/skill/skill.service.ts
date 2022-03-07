import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { PaginateModel, PaginateResult } from 'mongoose';
import { MONGO_SCHEMA_ERROR_CODE, SKILL_CONSTANT } from 'src/@core/constants/api-error-constants';
import { BC_PAYLOAD } from 'src/@core/constants/bc-constants/bc-payload.constant';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { BC_STATUS } from 'src/@core/constants/bc-status.enum';
import { getSearchFilter, getSearchFilterWithRegex } from 'src/@core/utils/query-filter.utils';
import { SkillDto } from './dto/skill.dto';
import { ISkill } from './interface/skill.interface';
import { SkillBcService } from './skill-bc.service';
import { BcUserDto } from 'src/@core/common/bc-user.dto';

@Injectable()
export class SkillService {
    constructor(@InjectModel('skill') private readonly SkillModel: PaginateModel<ISkill>, private readonly skillBcService: SkillBcService) {}

    async createSkill(newSkillDto: SkillDto, req: Request): Promise<ISkill> {
        newSkillDto['createdBy'] = req['user']._id;
        const newSkill = new this.SkillModel(newSkillDto);
        try {
            const skillSaved: any = await newSkill.save();
            if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                const bcUserDto = new BcUserDto();
                bcUserDto.loggedInUserId = req['user']._id;
                bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
                await this.skillBcService.storeSkillBC(skillSaved, bcUserDto, BC_PAYLOAD.CREATE_SKILL);
                const blockchainVerified = await this.skillBcService.getBlockchainVerified(skillSaved, bcUserDto);
                return { ...skillSaved._doc, blockchainVerified };
            }
            return skillSaved;
        } catch (error) {
            if (error.code && error.code === MONGO_SCHEMA_ERROR_CODE.DUPLICATE_KEY) throw new NotAcceptableException([SKILL_CONSTANT.SKILL_ALREADY_CREATED]);
            throw new BadRequestException([SKILL_CONSTANT.FAILED_TO_CREATE_SKILL]);
        }
    }

    async findSkillById(id: string): Promise<ISkill> {
        const skill = await this.SkillModel.findById(id);
        if (!skill) {
            throw new NotFoundException(SKILL_CONSTANT.SKILL_NOT_FOUND);
        }
        return skill;
    }

    async findAllSkill(req: Request): Promise<PaginateResult<ISkill> | { docs: ISkill[] }> {
        const { page, limit, search } = req.query;
        if (!page || !limit) {
            const skillResult = await this.SkillModel.find({ status: true });
            return { docs: skillResult };
        }
        let query: any = { status: true };
        if (search) {
            const filterForStringField = getSearchFilterWithRegex(req.query, ['title']);
            const filterForNonStringField = getSearchFilter(req.query, ['createdBy', 'status']);
            query = { ...filterForStringField, ...filterForNonStringField };
        }
        const options = {
            page: Number(page),
            limit: Number(limit)
        };
        const skillsData = await this.SkillModel.paginate(query, options);
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            skillsData.docs = await this.skillBcService.getBlockchainVerifiedList(skillsData.docs, bcUserDto);
        }
        return skillsData;
    }

    async updateSkill(id: string, updateSkillDto: SkillDto, req: Request): Promise<ISkill> {
        const skill = await this.findSkillById(id);
        try {
            const skillUpdated = await skill.update(updateSkillDto);
            if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                const skill = await this.findSkillById(id);
                const bcUserDto = new BcUserDto();
                bcUserDto.loggedInUserId = req['user']._id;
                bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
                await this.skillBcService.storeSkillBC(skill, bcUserDto, BC_PAYLOAD.UPDATE_SKILL);
            }
            return skillUpdated;
        } catch (error) {
            if (error.code && error.code === MONGO_SCHEMA_ERROR_CODE.DUPLICATE_KEY) throw new NotAcceptableException([SKILL_CONSTANT.SKILL_ALREADY_CREATED]);
            throw new BadRequestException([SKILL_CONSTANT.FAILED_TO_UPDATE_SKILL]);
        }
    }

    async deleteSkill(id: string, req: Request): Promise<ISkill> {
        const skill = await this.findSkillById(id);
        const skillUpdated = await skill.update({ status: false });
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const skill = await this.findSkillById(id);
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.skillBcService.storeSkillBC(skill, bcUserDto, BC_PAYLOAD.DELETE_SKILL);
        }
        return skillUpdated;
    }

    /**
     * Find Skill Blockchain History
     * Calls getSkillBcHistory function of skill blockchain service. If skill not found, throws an error.
     *
     *
     * @param {Request} options - Option of type Request
     * @param {string} skillId - Id of the skill to get the history from blockchain
     *
     *
     **/
    async findSkillBlockchainHistory(options: Request, skillId: string): Promise<any> {
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = options['user']._id;
            bcUserDto.company = options['user'].company.find((defaultCompany) => defaultCompany.default);
            const blockchainHistory = await this.skillBcService.getSkillBcHistory(bcUserDto, skillId);
            if (blockchainHistory.length == 0) {
                throw new NotFoundException(BC_ERROR_RESPONSE.BLOCKCHAIN_HISTORY_NOT_FOUND);
            }
            const skillData = await this.findSkillById(skillId);
            return {
                blockchainHistory,
                skillData
            };
        } else {
            throw new BadRequestException(BC_ERROR_RESPONSE.BLOCKCHAIN_NOT_ENABLED);
        }
    }
}

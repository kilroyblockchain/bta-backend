import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { PaginateModel, PaginateResult } from 'mongoose';
import { LANGUAGE_CONSTANT, MONGO_SCHEMA_ERROR_CODE } from 'src/@core/constants/api-error-constants';
import { BC_PAYLOAD } from 'src/@core/constants/bc-constants/bc-payload.constant';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { BC_STATUS } from 'src/@core/constants/bc-status.enum';
import { getSearchFilter, getSearchFilterWithRegex } from 'src/@core/utils/query-filter.utils';
import { LanguageDto } from './dto/language.dto';
import { ILanguage } from './interface/language.interface';
import { LanguageBcService } from './language-bc.service';
import { BcUserDto } from 'src/@core/common/bc-user.dto';

@Injectable()
export class LanguageService {
    constructor(
        @InjectModel('language')
        private readonly LanguageModel: PaginateModel<ILanguage>,
        private readonly languageBcService: LanguageBcService
    ) {}

    async createLanguage(newLanguageDto: LanguageDto, req: Request): Promise<ILanguage> {
        newLanguageDto['createdBy'] = req['user']._id;
        const newLanguage = new this.LanguageModel(newLanguageDto);
        try {
            const languageSaved = await newLanguage.save();
            if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                const bcUserDto = new BcUserDto();
                bcUserDto.loggedInUserId = req['user']._id;
                bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
                await this.languageBcService.storeLanguageBC(languageSaved, bcUserDto, BC_PAYLOAD.CREATE_LANGUAGE);
            }
            return languageSaved;
        } catch (error) {
            if (error.code && error.code === MONGO_SCHEMA_ERROR_CODE.DUPLICATE_KEY) throw new NotAcceptableException([LANGUAGE_CONSTANT.LANGUAGE_ALREADY_CREATED]);
            throw new BadRequestException([LANGUAGE_CONSTANT.FAILED_TO_CREATE_LANGUAGE]);
        }
    }

    async findLanguageById(id: string): Promise<ILanguage> {
        const language = await this.LanguageModel.findById(id);
        if (!language) {
            throw new NotFoundException(LANGUAGE_CONSTANT.LANGUAGE_NOT_FOUND);
        }
        return language;
    }

    async findAllLanguage(req: Request): Promise<PaginateResult<ILanguage> | { docs: ILanguage[] }> {
        const { page, limit, search } = req.query;
        if (!page || !limit) {
            const languageResult = await this.LanguageModel.find({ status: true });
            return { docs: languageResult };
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
        const languageData = await this.LanguageModel.paginate(query, options);
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            languageData.docs = await this.languageBcService.getBlockchainVerifiedList(languageData.docs, bcUserDto);
        }
        return languageData;
    }

    async updateLanguage(id: string, updateLanguageDto: LanguageDto, req: Request): Promise<ILanguage> {
        const language = await this.findLanguageById(id);
        try {
            const languageUpdated = await language.update(updateLanguageDto);
            if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                const bcUserDto = new BcUserDto();
                bcUserDto.loggedInUserId = req['user']._id;
                bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
                await this.languageBcService.storeLanguageBC(languageUpdated, bcUserDto, BC_PAYLOAD.UPDATE_LANGUAGE);
            }
            return languageUpdated;
        } catch (error) {
            if (error.code && error.code === MONGO_SCHEMA_ERROR_CODE.DUPLICATE_KEY) throw new NotAcceptableException([LANGUAGE_CONSTANT.LANGUAGE_ALREADY_CREATED]);
            throw new BadRequestException([LANGUAGE_CONSTANT.FAILED_TO_UPDATE_LANGUAGE]);
        }
    }

    async deleteLanguage(id: string, req: Request): Promise<ILanguage> {
        const language = await this.findLanguageById(id);
        const languageUpdated = await language.update({ status: false });
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.languageBcService.storeLanguageBC(languageUpdated, bcUserDto, BC_PAYLOAD.DELETE_LANGUAGE);
        }
        return languageUpdated;
    }

    /**
     * Find Language Blockchain History
     * Calls getLanguageBcHistory function of language blockchain service. If language not found, throws an error.
     *
     *
     * @param {Request} options - Option of type Request
     * @param {string} languageId - Id of the language to get the history from blockchain
     *
     *
     **/
    async findLanguageBlockchainHistory(options: Request, languageId: string): Promise<any> {
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = options['user']._id;
            bcUserDto.company = options['user'].company.find((defaultCompany) => defaultCompany.default);
            const blockchainHistory = await this.languageBcService.getLanguageBcHistory(bcUserDto, languageId);
            if (blockchainHistory.length == 0) {
                throw new NotFoundException(BC_ERROR_RESPONSE.BLOCKCHAIN_HISTORY_NOT_FOUND);
            }
            const languageData = await this.findLanguageById(languageId);
            return {
                blockchainHistory,
                languageData
            };
        } else {
            throw new BadRequestException(BC_ERROR_RESPONSE.BLOCKCHAIN_NOT_ENABLED);
        }
    }
}

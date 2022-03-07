import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { PaginateModel, PaginateResult } from 'mongoose';
import { CompanyBranchDto } from 'src/components/shared/company-branch/dto/company-branch.dto';
import { ICompanyBranch, ICompanyBranchResponse } from 'src/components/shared/company-branch/interface/company-branch.interface';
import { COMPANY_BRANCH_CONSTANT, MONGO_SCHEMA_ERROR_CODE } from 'src/@core/constants/api-error-constants';
import { AuthService } from 'src/components/auth/auth.service';
import { getSearchFilterWithRegexAll } from 'src/@core/utils/query-filter.utils';
import { BC_STATUS } from 'src/@core/constants/bc-status.enum';
import { CompanyBranchBcService } from './company-branch-bc.service';
import { BC_PAYLOAD } from 'src/@core/constants/bc-constants/bc-payload.constant';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { BcUserDto } from 'src/@core/common/bc-user.dto';

@Injectable()
export class CompanyBranchService {
    constructor(@InjectModel('CompanyBranch') private readonly CompanyBranchModel: PaginateModel<ICompanyBranch>, private authService: AuthService, private readonly companyBranchBcService: CompanyBranchBcService) {}

    async createCompanyBranch(newCompanyBranchDto: CompanyBranchDto, req: Request): Promise<ICompanyBranchResponse> {
        try {
            const company = this.authService.getDefaultCompany(req);
            newCompanyBranchDto['companyId'] = company.companyId;
            newCompanyBranchDto['addedBy'] = req['user']._id;
            const newCompanyBranch = new this.CompanyBranchModel(newCompanyBranchDto);
            const companyBranch = await newCompanyBranch.save();
            if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                const bcUserDto = new BcUserDto();
                bcUserDto.loggedInUserId = req['user']._id;
                bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
                const companyBranchSaved = await this.CompanyBranchModel.findById(companyBranch.id);
                await this.companyBranchBcService.storeCompanyBranchBC(companyBranchSaved, bcUserDto, BC_PAYLOAD.CREATE_COMPANY_BRANCH);
                companyBranch.blockchainVerified = await this.companyBranchBcService.getBlockchainVerified(companyBranchSaved, bcUserDto);
            }
            return this.buildCompanyBranchInfo(companyBranch);
        } catch (err) {
            this.handleDuplicateFieldError(err);
            throw new BadRequestException(COMPANY_BRANCH_CONSTANT.FAILED_TO_CREATE_COMPANY_BRANCH, err);
        }
    }

    async findCompanyBranchById(id: string): Promise<ICompanyBranchResponse> {
        const companyBranch = await this.CompanyBranchModel.findById(id);
        if (!companyBranch) {
            throw new NotFoundException(COMPANY_BRANCH_CONSTANT.COMPANY_BRANCH_NOT_FOUND);
        }
        return this.buildCompanyBranchInfo(companyBranch);
    }

    // Find Company Branch By ID with BC verified
    async findCompanyBranchByIdBcVerified(id: string, req: Request): Promise<ICompanyBranchResponse> {
        const companyBranch = await this.CompanyBranchModel.findById(id);
        if (!companyBranch) {
            throw new NotFoundException(COMPANY_BRANCH_CONSTANT.COMPANY_BRANCH_NOT_FOUND);
        }
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            companyBranch.blockchainVerified = await this.companyBranchBcService.getBlockchainVerified(companyBranch, bcUserDto);
        }
        return this.buildCompanyBranchInfo(companyBranch);
    }

    async findAllCompanyBranch(req: Request, activeBranches = false): Promise<PaginateResult<ICompanyBranch> | { docs: ICompanyBranchResponse[] }> {
        const company = this.authService.getDefaultCompany(req);
        const { page, limit, search, status, searchValue } = req.query;
        const searchQuery = search && search === 'true' && searchValue ? getSearchFilterWithRegexAll(searchValue, ['name', 'address', 'zipCode']) : {};
        const statusQuery = activeBranches ? { status: true } : { status: status && status.toString().toUpperCase() === 'TRUE' ? true : false };
        const query: any = { companyId: company.companyId, ...statusQuery, ...searchQuery };
        const options = {
            populate: { path: 'country state', select: 'name' },
            page: !isNaN(Number(page)) ? Number(page) : 1,
            limit: !isNaN(Number(limit)) ? Number(limit) : 10
        };
        const companyBranchData = await this.CompanyBranchModel.paginate(query, options);
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            companyBranchData.docs = await this.companyBranchBcService.getBlockchainVerifiedList(companyBranchData.docs, bcUserDto);
        }
        return this.buildPaginateCompanyBranchInfo(companyBranchData);
    }

    async findAllCompanyBranchByCompanyId(companyId: string, options = null) {
        const query: any = { companyId: companyId, status: true, ...(options.query ? options.query : {}) };
        const paginateOption = {
            populate: { path: 'country state', select: 'name' },
            page: !isNaN(Number(options?.page)) ? Number(options?.page) : 1,
            limit: !isNaN(Number(options?.limit)) ? Number(options?.limit) : Number.MAX_SAFE_INTEGER
        };
        const companyBranchData = await this.CompanyBranchModel.paginate(query, paginateOption);
        return this.buildPaginateCompanyBranchInfo(companyBranchData);
    }

    async updateCompanyBranch(id: string, updateCompanyBranchDto: CompanyBranchDto, req: Request): Promise<ICompanyBranchResponse> {
        try {
            const companyBranch = await this.CompanyBranchModel.findByIdAndUpdate(id, updateCompanyBranchDto, {
                new: true
            }).populate({ path: 'country state', select: 'name' });
            if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                const bcUserDto = new BcUserDto();
                bcUserDto.loggedInUserId = req['user']._id;
                bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
                const companyBranchSaved = await this.CompanyBranchModel.findById(companyBranch.id);
                await this.companyBranchBcService.storeCompanyBranchBC(companyBranchSaved, bcUserDto, BC_PAYLOAD.UPDATE_COMPANY_BRANCH);
                companyBranch.blockchainVerified = await this.companyBranchBcService.getBlockchainVerified(companyBranchSaved, bcUserDto);
            }
            return this.buildCompanyBranchInfo(companyBranch);
        } catch (err) {
            this.handleDuplicateFieldError(err);
            throw new BadRequestException(COMPANY_BRANCH_CONSTANT.FAILED_TO_UPDATE_COMPANY_BRANCH, err);
        }
    }

    async disableCompanyBranch(id: string, req): Promise<ICompanyBranchResponse> {
        try {
            const companyBranch = await this.CompanyBranchModel.findByIdAndUpdate(
                id,
                { status: false },
                {
                    new: true
                }
            );
            if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                const bcUserDto = new BcUserDto();
                bcUserDto.loggedInUserId = req['user']._id;
                bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
                const companyBranchSaved = await this.CompanyBranchModel.findById(companyBranch.id);
                await this.companyBranchBcService.storeCompanyBranchBC(companyBranchSaved, bcUserDto, BC_PAYLOAD.DISABLE_COMPANY_BRANCH);
            }
            return this.buildCompanyBranchInfo(companyBranch);
        } catch (err) {
            throw new BadRequestException(COMPANY_BRANCH_CONSTANT.FAILED_TO_DISABLE_COMPANY_BRANCH, err);
        }
    }

    async enableCompanyBranch(id: string, req: Request): Promise<ICompanyBranchResponse> {
        const companyBranch = await this.findCompanyBranchById(id);
        if (companyBranch.status) {
            throw new BadRequestException(COMPANY_BRANCH_CONSTANT.COMPANY_BRANCH_ALREADY_ENABLED);
        }
        try {
            const companyBranchSaved = await this.CompanyBranchModel.findByIdAndUpdate(
                id,
                { status: true },
                {
                    new: true
                }
            );
            if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                const bcUserDto = new BcUserDto();
                bcUserDto.loggedInUserId = req['user']._id;
                bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
                const companyBranchSaved = await this.CompanyBranchModel.findById(companyBranch.id);
                await this.companyBranchBcService.storeCompanyBranchBC(companyBranchSaved, bcUserDto, BC_PAYLOAD.ENABLE_COMPANY_BRANCH);
            }
            return this.buildCompanyBranchInfo(companyBranchSaved);
        } catch (err) {
            throw new BadRequestException(COMPANY_BRANCH_CONSTANT.FAILED_TO_ENABLE_COMPANY_BRANCH, err);
        }
    }

    private buildCompanyBranchInfo(companyBranch: ICompanyBranch): any {
        return {
            id: companyBranch._id,
            companyId: companyBranch.companyId,
            addedBy: companyBranch.addedBy,
            branchId: companyBranch.branchId,
            name: companyBranch.name,
            country: companyBranch.country,
            state: companyBranch.state,
            address: companyBranch.address,
            zipCode: companyBranch.zipCode,
            useInReport: companyBranch.useInReport,
            status: companyBranch.status,
            blockchainVerified: companyBranch.blockchainVerified
        };
    }

    buildPaginateCompanyBranchInfo(companyBranchData: PaginateResult<ICompanyBranch>): PaginateResult<ICompanyBranchResponse> {
        return {
            docs: companyBranchData.docs.map((testResult) => this.buildCompanyBranchInfo(testResult)),
            page: companyBranchData.page,
            pages: companyBranchData?.pages,
            limit: companyBranchData.limit,
            total: companyBranchData.total,
            offset: companyBranchData?.offset
        };
    }

    handleDuplicateFieldError(err: any): void {
        if (err.code && err.code === MONGO_SCHEMA_ERROR_CODE.DUPLICATE_KEY) {
            throw new BadRequestException(COMPANY_BRANCH_CONSTANT.COMPANY_BRANCH_ALREADY_EXISTS);
        }
    }

    async getCompanyBranchBlockchainHistory(req: Request, companyBranchId: string) {
        const logger = new Logger('CompanyBranchBcHistory');
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            const blockchainHistory = await this.companyBranchBcService.getCompanyBranchBcHistory(bcUserDto, companyBranchId);
            if (blockchainHistory.length == 0) {
                throw new NotFoundException(BC_ERROR_RESPONSE.BLOCKCHAIN_HISTORY_NOT_FOUND);
            }
            const companyBranch = await this.findCompanyBranchByIdBcVerified(companyBranchId, req);
            return {
                blockchainHistory,
                companyBranch
            };
        } else {
            logger.error(BC_ERROR_RESPONSE.BLOCKCHAIN_NOT_ENABLED);
            throw new BadRequestException(BC_ERROR_RESPONSE.BLOCKCHAIN_NOT_ENABLED);
        }
    }

    async findCompanyBranchByName(name: string, companyId: string): Promise<ICompanyBranchResponse> {
        const companyBranch = await this.CompanyBranchModel.findOne({ name, companyId });
        if (companyBranch) {
            return this.buildCompanyBranchInfo(companyBranch);
        }
        return null;
    }
}

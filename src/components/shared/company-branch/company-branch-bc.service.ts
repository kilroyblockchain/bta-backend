import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { BcUserDto } from 'src/@core/common/bc-user.dto';
import { COMMON_ERROR } from 'src/@core/constants/api-error-constants';
import { BC_CHAINCODE_FUNCTION } from 'src/@core/constants/bc-constants/bc-chaincode-function.constant';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { BcRequestDto } from 'src/@core/constants/dto/bc-request.dto';
import { CaService } from 'src/components/certificate-authority/ca-client.service';
import { sha256Hash } from 'src/components/utils/helpers';
import { CompanyBranchBcDto } from './dto/company-branch-bc.dto';

@Injectable()
export class CompanyBranchBcService {
    constructor(private readonly caService: CaService) {}

    /**
     * Store Company Branch data on BC
     *
     * @param {any} companyBranchData - Object of Company Branch Data
     * @param {string} userId - Logged in user Id
     * @param {string} payload - Value to be passed on payload to differentiate Create/Update
     *
     *
     **/

    async storeCompanyBranchBC(companyBranchData: any, bcUserDto: BcUserDto, payload: string) {
        const logger = new Logger('StoreCompanyBranchBC');
        try {
            // Company Branch Data type any to Company Branch BC Dto data
            const companyBranchBcData = await this.toCompanyBranchBcDto(companyBranchData);
            // Creates hash value from required data
            const hashValue = await this.createHash(companyBranchBcData);
            const companyBranchId = companyBranchBcData._id;
            const bcRequestDto = new BcRequestDto();
            bcRequestDto.function = BC_CHAINCODE_FUNCTION.CREATE_COMPANY_BRANCH;
            bcRequestDto.data = {
                companyBranchId: companyBranchId,
                hash: hashValue,
                payload: payload
            };
            await this.caService.createEntry(bcRequestDto, bcUserDto);
        } catch (err) {
            logger.error(err);
            throw new HttpException(BC_ERROR_RESPONSE.FETCH_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store Company Branch data on BC
     *
     * @param {any} companyBranchData - Object of Company Branch Data
     * @param {string} userId - Logged in user Id
     * @param {string} payload - Value to be passed on payload to differentiate Create/Update
     *
     *
     **/

    async storeCompanyBranchListBC(companyBranchList: any, bcUserDto: BcUserDto, payload: string) {
        const logger = new Logger('StoreCompanyBranchBC');
        try {
            const bcRequestDto = new BcRequestDto();
            const bcRequestDataList = [];
            for (const companyBranchData of companyBranchList) {
                // Company Branch Data type any to Company Branch BC Dto data
                const companyBranchBcData = await this.toCompanyBranchBcDto(companyBranchData);
                // Creates hash value from required data
                const hashValue = await this.createHash(companyBranchBcData);
                const companyBranchId = companyBranchBcData._id;
                bcRequestDto.function = BC_CHAINCODE_FUNCTION.CREATE_COMPANY_BRANCH_BATCH;
                const bcRequestData = {
                    companyBranchId: companyBranchId,
                    hash: hashValue,
                    payload: payload
                };
                bcRequestDataList.push(bcRequestData);
            }
            bcRequestDto.data = bcRequestDataList;
            await this.caService.createEntry(bcRequestDto, bcUserDto);
        } catch (err) {
            logger.error(err);
            throw new HttpException(BC_ERROR_RESPONSE.FETCH_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get single data from blockchain current state and check's the hash from the blockchain with the MongoDB payload
     *
     *
     * @param {any} companyBranchData - Object of company branch data from mongodb
     * @param {string} userId - Unique Id of the logged in user
     *
     *
     **/
    async getBlockchainVerified(companyBranchData: any, bcUserDto: BcUserDto) {
        const logger = new Logger('GetBlockchainVerifiedCompanyBranch');
        let blockchainVerified = false;
        try {
            if (companyBranchData) {
                // CompanyBranch Data type any to company branch BC Dto data
                const companyBranchBcData = await this.toCompanyBranchBcDto(companyBranchData);
                // Creates hash value from required data
                const hashValue = await this.createHash(companyBranchBcData);
                const companyBranchId = companyBranchBcData._id;
                const bcRequestDto = new BcRequestDto();
                bcRequestDto.function = BC_CHAINCODE_FUNCTION.GET_COMPANY_BRANCH;
                bcRequestDto.data = {
                    companyBranchId: companyBranchId
                };
                blockchainVerified = await this.caService.getBlockchainVerified(hashValue, bcRequestDto, bcUserDto);
            }
            return blockchainVerified;
        } catch (err) {
            logger.error(err);
            throw new HttpException(BC_ERROR_RESPONSE.FETCH_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get list data from blockchain current state and check's the hashes from the blockchain with the MongoDB payload
     *
     *
     * @param {any} companyBranchList - List of company branch from mongodb
     * @param {string} userId - Unique Id of the logged in user
     *
     *
     **/
    async getBlockchainVerifiedList(companyBranchList: any, bcUserDto: BcUserDto): Promise<any> {
        return await Promise.all(
            await companyBranchList.map(async (doc) => {
                const blockchainVerified = await this.getBlockchainVerified(doc, bcUserDto);
                if ('_doc' in doc) {
                    return { ...doc._doc, blockchainVerified };
                } else {
                    return { ...doc, blockchainVerified };
                }
            })
        );
    }

    /**
     * Get all the state data from blockchain (history) of particular company branch
     *
     *
     * @param {string} userId - Unique Id of the logged in user
     * @param {string} companyBranchId - Id of the company branch to get the history from blockchain
     *
     *
     **/
    async getCompanyBranchBcHistory(bcUserDto: BcUserDto, companyBranchId: string): Promise<any> {
        const logger = new Logger('GetCompanyBranchBcHistory');
        try {
            const bcRequestDto = new BcRequestDto();
            bcRequestDto.function = BC_CHAINCODE_FUNCTION.GET_COMPANY_BRANCH_HISTORY;
            bcRequestDto.data = {
                companyBranchId: companyBranchId
            };
            return await this.caService.getBlockchainHistory(bcUserDto, bcRequestDto);
        } catch (err) {
            logger.error(err);
            throw new HttpException(BC_ERROR_RESPONSE.FETCH_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Generate sha256 hash of the company branch data
     *
     *
     * @param {CompanyBranchBcDto} companyBranchBcDto - Object of company branch bc dto for hashing
     * @return {Promise<string>} - Returns Promise of hashed hex string
     *
     *
     **/
    private async createHash(companyBranchBcDto: CompanyBranchBcDto): Promise<string> {
        return await sha256Hash(JSON.stringify(companyBranchBcDto));
    }

    /**
     * Map Data to Company Branch Bc Dto
     *
     *
     * @param {any} companyBranchData - Object of Company Branch for mapping to BC Dto
     * @return {Promise<CompanyBranchBcDto>} - Returns Promise of CompanyBranchBcDto
     *
     *
     **/
    private async toCompanyBranchBcDto(companyBranchData: any): Promise<CompanyBranchBcDto> {
        const logger = new Logger('ToCompanyBranchBcDto');
        try {
            const companyBranchBcDto = new CompanyBranchBcDto();
            companyBranchBcDto._id = companyBranchData._id;
            companyBranchBcDto.country = companyBranchData.country == null ? null : companyBranchData.country._id;
            companyBranchBcDto.state = companyBranchData.state == null ? null : companyBranchData.state._id;
            companyBranchBcDto.status = companyBranchData.status;
            companyBranchBcDto.name = companyBranchData.name;
            companyBranchBcDto.address = companyBranchData.address;
            companyBranchBcDto.zipCode = companyBranchData.zipCode;
            companyBranchBcDto.companyId = companyBranchData.companyId == null ? null : companyBranchData.companyId._id;
            companyBranchBcDto.addedBy = companyBranchData.addedBy == null ? null : companyBranchData.addedBy._id;
            companyBranchBcDto.createdAt = companyBranchData.createdAt;
            companyBranchBcDto.updatedAt = companyBranchData.updatedAt;
            return companyBranchBcDto;
        } catch (err) {
            logger.error(err);
            throw new HttpException(COMMON_ERROR.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

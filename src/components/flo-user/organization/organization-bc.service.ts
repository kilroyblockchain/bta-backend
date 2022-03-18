import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { BcUserDto } from 'src/@core/common/bc-user.dto';
import { COMMON_ERROR } from 'src/@core/constants/api-error-constants';
import { BC_CHAINCODE_FUNCTION } from 'src/@core/constants/bc-constants/bc-chaincode-function.constant';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { BcRequestDto } from 'src/@core/constants/dto/bc-request.dto';
import { BcHistoryResponseDto } from 'src/components/blockchain/dto/bc-history-response.dto';
import { CaService } from 'src/components/certificate-authority/ca-client.service';
import { sha256Hash } from 'src/components/utils/helpers';
import { OrganizationBcDto } from './dto/organization-bc.dto';
import { IOrganizationBc } from './interfaces/organization.interface';

@Injectable()
export class OrganizationBcService {
    constructor(private readonly caService: CaService) {}

    /**
     * Store Organization data on BC
     *
     * @param {IOrganizationBc} organizationData - Object of Organization Data
     * @param {string} userId - Logged in user Id
     * @param {string} payload - Value to be passed on payload to differentiate Create/Update
     *
     *
     **/
    async storeOrganizationBC(organizationData: IOrganizationBc, bcUserDto: BcUserDto, payload: string): Promise<void> {
        const logger = new Logger('StoreOrganizationBC');
        try {
            // Organization Data type any to Organization BC Dto data
            const organizationBcData = await this.toOrganizationBcDto(organizationData);
            // Creates hash value from required data
            const hashValue = await this.createHash(organizationBcData);
            const organizationId = organizationBcData._id;
            const bcRequestDto = new BcRequestDto();
            bcRequestDto.function = BC_CHAINCODE_FUNCTION.CREATE_ORGANIZATION;
            bcRequestDto.data = {
                organizationId: organizationId,
                hash: hashValue,
                payload: payload
            };
            await this.caService.createEntry(bcRequestDto, bcUserDto);
        } catch (err) {
            logger.error('Payload: ', payload);
            logger.error(err);
            throw new HttpException(BC_ERROR_RESPONSE.STORE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get's single data from blockchain current state and check's the hash from the blockchain with the MongoDB payload
     *
     *
     * @param {IOrganizationBc} organizationData - Object of organization data from mongodb
     * @param {string} userId - Unique Id of the logged in user
     *
     *
     **/
    async getBlockchainVerified(organizationData: IOrganizationBc, bcUserDto: BcUserDto): Promise<boolean> {
        const logger = new Logger('GetBlockchainVerifiedOrganization');
        let blockchainVerified = false;
        try {
            if (organizationData) {
                // Organization Data type any to Organization BC Dto data
                const organizationBcDto = await this.toOrganizationBcDto(organizationData);
                // Creates hash value from required data
                const hashValue = await this.createHash(organizationBcDto);
                const organizationId = organizationBcDto._id;
                const bcRequestDto = new BcRequestDto();
                bcRequestDto.function = BC_CHAINCODE_FUNCTION.GET_ORGANIZATION;
                bcRequestDto.data = {
                    organizationId: organizationId
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
     * @param {IOrganizationBc[]} organizationIdList - List of OrganizationId from mongodb
     * @param {string} userId - Unique Id of the logged in user
     *
     *
     **/
    async getBlockchainVerifiedList(organizationIdList: IOrganizationBc[], bcUserDto: BcUserDto): Promise<IOrganizationBc[]> {
        return await Promise.all(
            await organizationIdList.map(async (organization) => {
                const blockchainVerified = await this.getBlockchainVerified(organization, bcUserDto);
                organization.blockchainVerified = blockchainVerified;
                return organization;
            })
        );
    }

    /**
     * Get all the state data from blockchain (history) of particular organization
     *
     *
     * @param {string} userId - Unique Id of the logged in user
     * @param {string} organizationId - Id of the organization to get the history from blockchain
     *
     *
     **/
    async getOrganizationBcHistory(bcUserDto: BcUserDto, organizationId: string): Promise<BcHistoryResponseDto[]> {
        const logger = new Logger('GetOrganizationBcHistory');
        try {
            const bcRequestDto = new BcRequestDto();
            bcRequestDto.function = BC_CHAINCODE_FUNCTION.GET_ORGANIZATION_HISTORY;
            bcRequestDto.data = {
                organizationId: organizationId
            };
            return await this.caService.getBlockchainHistory(bcUserDto, bcRequestDto);
        } catch (err) {
            logger.error(err);
            throw new HttpException(BC_ERROR_RESPONSE.FETCH_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Generate sha256 hash of the organization data
     *
     *
     * @param {any} organizationBcDto - Object of training organization data for hashing
     * @return {Promise<string>} - Returns Promise of hashed hex string
     *
     *
     **/
    private async createHash(organizationBcDto: OrganizationBcDto): Promise<string> {
        return await sha256Hash(JSON.stringify(organizationBcDto));
    }

    /**
     * Map Data to Organization Bc Dto
     *
     *
     * @param {IOrganizationBc} organizationData - Object of training organization data for mapping to BC Dto
     * @return {Promise<OrganizationBcDto>} - Returns Promise of OrganizationBcDto
     *
     *
     **/
    private async toOrganizationBcDto(organizationData: IOrganizationBc): Promise<OrganizationBcDto> {
        const logger = new Logger('ToOrganizationBcDto');
        try {
            const organizationBcDto = new OrganizationBcDto();
            organizationBcDto._id = organizationData._id;
            organizationBcDto.isDeleted = organizationData.isDeleted;
            organizationBcDto.companyName = organizationData.companyName;
            organizationBcDto.country = organizationData.country;
            organizationBcDto.state = organizationData.state;
            organizationBcDto.address = organizationData.address;
            organizationBcDto.zipCode = organizationData.zipCode;
            return organizationBcDto;
        } catch (err) {
            logger.error(err);
            logger.error('Organization Data on param: ', JSON.stringify(organizationData));
            throw new HttpException(COMMON_ERROR.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

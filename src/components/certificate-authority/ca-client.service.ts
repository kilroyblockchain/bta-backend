import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { BcRequestDto } from 'src/@core/constants/dto/bc-request.dto';
import { BcUserDto } from 'src/@core/common/bc-user.dto';
import 'dotenv/config';
import { ChannelMappingService } from '../blockchain/channel-mapping/channel-mapping.service';
import { ChannelMappingDto } from '../blockchain/channel-mapping/dto/channel-mapping.dto';
import { generateUniqueId } from 'src/@utils/helpers';
import { BcConnectionService } from '../blockchain/bc-connection/bc-connection.service';
import { BcConnectionDto } from '../blockchain/bc-connection/dto/bc-connection.dto';
import { BcQueryResponseDto } from '../blockchain/dto/bc-query-response.dto';
import { BcHistoryResponseDto } from '../blockchain/dto/bc-history-response.dto';
import { ICompany } from '../flo-user/user/interfaces/user.interface';
import { StaffingInterface } from '../flo-user/user-roles/organization-staffing/interfaces/organization-staffing.interface';
import { ChannelMappingResponseDto } from '../blockchain/channel-mapping/dto/channel-mapping-response.dto';

@Injectable()
export class CaService {
    constructor(private readonly channelMappingService: ChannelMappingService, private readonly bcConnectionService: BcConnectionService) {}

    async checkBcUser(username: string): Promise<void> {
        await this.bcConnectionService.checkUser(username);
    }

    async userRegistrationListStaffing(staffingList: [string], bcUserDto: BcUserDto, organizationId?: string, channelId?: string): Promise<void> {
        for (const staffing of staffingList) {
            await this.userRegistration(bcUserDto, staffing, organizationId, channelId);
        }
    }

    /**
     * Register User on Blockchain Network and store user certificate on Wallet
     *
     *
     * @param {BcUserDto} bcUserDto - Object of BcUserDto
     * @param {string} bcUserDto.enrollmentId - Id to be enrolled on the blockchain network
     * @param {string} bcUserDto.enrollmentSecret - Password for the enrollment id.
     *
     *
     **/
    async userRegistration(bcUserDto: BcUserDto, staffingId: string, organizationId?: string, channelId?: string): Promise<void> {
        const logger = new Logger('UserRegistration');
        try {
            // const loggedInUser = this.request['user']._id;
            const loggedInUser = bcUserDto.loggedInUserId;
            const company = bcUserDto.company;
            // const company = this.request['user'].company.find(defaultCompany => defaultCompany.default);
            const loginUserStaffingId = company.staffingId.length > 0 ? (company.staffingId[0] as StaffingInterface)._id : null;
            const channelMappingResponse = await this.channelMappingService.getChannelMappingByUserOrganizationAndStaffing(loggedInUser, company.companyId as string, loginUserStaffingId);
            const walletId = generateUniqueId();
            const channelMappingDto = new ChannelMappingDto();
            if (!organizationId) {
                channelMappingDto.channelId = channelMappingResponse.channelMapping.channelId;
                channelMappingDto.organizationId = company.companyId as string;
            } else {
                channelMappingDto.channelId = channelId;
                channelMappingDto.organizationId = organizationId;
            }
            channelMappingDto.staffingId = staffingId;
            channelMappingDto.userId = bcUserDto.enrollmentId;
            channelMappingDto.walletId = walletId;
            await this.channelMappingService.addChannelMapping(channelMappingDto);
            await this.bcConnectionService.registerUser(walletId, channelMappingResponse.channelMapping.walletId);
        } catch (error) {
            logger.error(error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createEntry(bcRequestDto: BcRequestDto, bcUserDto: BcUserDto): Promise<BcConnectionDto> {
        // const company = this.request['user'].company.find(defaultCompany => defaultCompany.default);
        const channelMappingResponse = await this.channelMappingService.getChannelMappingByUserAndOrganization(bcUserDto.loggedInUserId, bcUserDto.company.companyId as string);
        return await this.bcConnectionService.invoke(bcRequestDto, channelMappingResponse.channelMapping.walletId);
    }

    async getEntryByKey(bcRequestDto: BcRequestDto, bcUserDto: BcUserDto): Promise<BcConnectionDto> {
        // const company = this.request['user'].company.find(defaultCompany => defaultCompany.default);
        const channelMappingResponse = await this.channelMappingService.getChannelMappingByUserAndOrganization(bcUserDto.loggedInUserId, bcUserDto.company.companyId as string);
        return await this.bcConnectionService.query(bcRequestDto, channelMappingResponse.channelMapping.walletId);
    }

    /**
     * Identify Blockchain Verified or not
     *
     * @param {string} hashDataToCompare - The hash created from data after fetched from DB.
     * @param {BcRequestDto} bcRequestDto - The request dto that is necessary to query blockchain
     * @return {Promise<Boolean>} - Returns boolean value of blockchain verified (true|false)
     *
     */
    async getBlockchainVerified(hashDataToCompare: string, bcRequestDto: BcRequestDto, bcUserDto: BcUserDto): Promise<boolean> {
        const blockchainData = await this.getEntryByKey(bcRequestDto, bcUserDto);
        if (blockchainData.data) {
            const bcData = blockchainData.data as BcQueryResponseDto;
            const hashFromBc = bcData.hash;
            return hashFromBc == hashDataToCompare ? true : false;
        } else {
            return false;
        }
    }

    /**
     * Get Blockchain History
     *
     * @param {string} userId - The Logged in user id.
     * @param {BcRequestDto} bcRequestDto - The request dto that is necessary to query blockchain
     * @return {Promise<Boolean>} - Returns history from blockchain.
     *
     */
    async getBlockchainHistory(bcUserDto: BcUserDto, bcRequestDto: BcRequestDto): Promise<BcHistoryResponseDto[]> {
        const blockchainData = await this.getEntryByKey(bcRequestDto, bcUserDto);
        const blockchainHistoryList = blockchainData.data as BcHistoryResponseDto[];
        blockchainHistoryList.forEach((blockchainHistory) => {
            blockchainHistory.TransactionDateTime = new Date(blockchainHistory.Timestamp);
        });
        return blockchainHistoryList;
    }

    /**
     * User revoked from Blockchain Network and removed user from wallet
     *
     *
     * @param {BcUserDto} bcUserDto - Object of BcUserDto
     * @param {string} bcUserDto.enrollmentId - Id to be enrolled on the blockchain network
     *
     *
     **/
    async revokeUserCert(bcUserDto: BcUserDto, staffingId: string): Promise<void> {
        const logger = new Logger('RevokeUserCert');
        try {
            logger.log(bcUserDto);
            logger.log(staffingId);
            //
            // *********Commented because user deactivation is not working for now*********
            // return this.bcConnectionService.deactivateUser(bcUserDto.enrollmentId);
            //
        } catch (error) {
            logger.error(error);
            return error;
        }
    }

    /**
     * User re-enroll on Blockchain Network and store user certificate on Wallet
     *
     *
     * @param {BcUserDto} bcUserDto - Object of BcUserDto
     * @param {string} bcUserDto.enrollmentId - Id to be enrolled on the blockchain network
     *
     *
     **/
    async userReEnroll(bcUserDto: BcUserDto, staffingId: string): Promise<void> {
        const logger = new Logger('UserReEnroll');
        try {
            logger.log(bcUserDto);
            logger.log(staffingId);
            //
            // *********Commented because user deactivation is not working for now*********
            // return this.bcConnectionService.activateUser(bcUserDto.enrollmentId);
            //
        } catch (error) {
            logger.error(error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async checkUserCert(userName: string, company: ICompany): Promise<boolean> {
        // const company = this.request['user'].company.find(defaultCompany => defaultCompany.default);
        const staffingId = company.staffingId.length > 0 ? (company.staffingId[0] as StaffingInterface)._id : null;
        const channelMappingResponse: ChannelMappingResponseDto = await this.channelMappingService.getChannelMappingByUserOrganizationAndStaffing(userName, company.companyId as string, staffingId);
        const walletId = channelMappingResponse.channelMapping.walletId;
        try {
            await this.checkBcUser(walletId);
            return true;
        } catch (err) {
            return false;
        }
    }

    async registerSuperAdmin(userId: string): Promise<void> {
        await this.bcConnectionService.registerUser(userId, null, true);
    }
}

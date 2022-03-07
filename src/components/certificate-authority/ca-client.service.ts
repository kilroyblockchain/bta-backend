import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { BcRequestDto } from 'src/@core/constants/dto/bc-request.dto';
import { BcUserDto } from 'src/@core/common/bc-user.dto';
import 'dotenv/config';
import { ChannelMappingService } from '../blockchain/channel-mapping/channel-mapping.service';
import { ChannelMappingDto } from '../blockchain/channel-mapping/dto/channel-mapping.dto';
import { generateUniqueId } from '../utils/helpers';
import { BcConnectionService } from '../blockchain/bc-connection/bc-connection.service';

@Injectable()
export class CaService {
    constructor(private readonly channelMappingService: ChannelMappingService, private readonly bcConnectionService: BcConnectionService) {}

    async checkBcUser(username: string): Promise<any> {
        await this.bcConnectionService.checkUser(username);
    }

    async userRegistrationListStaffing(staffingList: [string], bcUserDto: BcUserDto, organizationId?: string, channelId?: string): Promise<any> {
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
    async userRegistration(bcUserDto: BcUserDto, staffingId: string, organizationId?: string, channelId?: string): Promise<any> {
        const logger = new Logger('UserRegistration');
        try {
            // const loggedInUser = this.request['user']._id;
            const loggedInUser = bcUserDto.loggedInUserId;
            const company = bcUserDto.company;
            // const company = this.request['user'].company.find(defaultCompany => defaultCompany.default);
            const companyId = company.companyId;
            const loginUserStaffingId = company.staffingId.length > 0 ? company.staffingId[0]._id : null;
            const channelMappingResponse = await this.channelMappingService.getChannelMappingByUserOrganizationAndStaffing(loggedInUser, companyId, loginUserStaffingId);
            const walletId = generateUniqueId();
            const channelMappingDto = new ChannelMappingDto();
            if (!organizationId) {
                channelMappingDto.channelId = channelMappingResponse.channelId;
                channelMappingDto.organizationId = companyId;
            } else {
                channelMappingDto.channelId = channelId;
                channelMappingDto.organizationId = organizationId;
            }
            channelMappingDto.staffingId = staffingId;
            channelMappingDto.userId = bcUserDto.enrollmentId;
            channelMappingDto.walletId = walletId;
            await this.channelMappingService.addChannelMapping(channelMappingDto);
            await this.bcConnectionService.registerUser(walletId, channelMappingResponse.walletId);
        } catch (error) {
            logger.error(error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createEntry(bcRequestDto: BcRequestDto, bcUserDto: BcUserDto): Promise<any> {
        // const company = this.request['user'].company.find(defaultCompany => defaultCompany.default);
        const channelMappingResponse = await this.channelMappingService.getChannelMappingByUserAndOrganization(bcUserDto.loggedInUserId, bcUserDto.company.companyId);
        return await this.bcConnectionService.invoke(bcRequestDto, channelMappingResponse.walletId);
    }

    async getEntryByKey(bcRequestDto: BcRequestDto, bcUserDto: BcUserDto): Promise<any> {
        // const company = this.request['user'].company.find(defaultCompany => defaultCompany.default);
        const channelMappingResponse = await this.channelMappingService.getChannelMappingByUserAndOrganization(bcUserDto.loggedInUserId, bcUserDto.company.companyId);
        return await this.bcConnectionService.query(bcRequestDto, channelMappingResponse.walletId);
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
        if (blockchainData != '' && blockchainData.data) {
            const hashFromBc = blockchainData.data.hash;
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
    async getBlockchainHistory(bcUserDto: BcUserDto, bcRequestDto: BcRequestDto): Promise<any> {
        const blockchainData = await this.getEntryByKey(bcRequestDto, bcUserDto);
        blockchainData.data.forEach((blockchainHistory) => {
            blockchainHistory.Timestamp = new Date(blockchainHistory.Timestamp);
        });
        return blockchainData.data;
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
    async revokeUserCert(bcUserDto: BcUserDto, staffingId: string) {
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
    async userReEnroll(bcUserDto: BcUserDto, staffingId: string) {
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

    async getUserCert(userName: any, company: any) {
        // const company = this.request['user'].company.find(defaultCompany => defaultCompany.default);
        const staffingId = company.staffingId.length > 0 ? company.staffingId[0]._id : null;
        const channelMappingResponse: any = await this.channelMappingService.getChannelMappingByUserOrganizationAndStaffing(userName, company.companyId, staffingId);
        const walletId = channelMappingResponse.walletId;
        try {
            await this.checkBcUser(walletId);
            return true;
        } catch (err) {
            return false;
        }
    }

    async registerSuperAdmin(userId: string) {
        return this.bcConnectionService.registerUser(userId, null, true);
    }
}

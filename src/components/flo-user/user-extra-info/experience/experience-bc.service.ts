import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { BcUserDto } from 'src/@core/common/bc-user.dto';
import { COMMON_ERROR } from 'src/@core/constants/api-error-constants';
import { BC_CHAINCODE_FUNCTION } from 'src/@core/constants/bc-constants/bc-chaincode-function.constant';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { BcRequestDto } from 'src/@core/constants/dto/bc-request.dto';
import { CaService } from 'src/components/certificate-authority/ca-client.service';
import { sha256Hash } from 'src/components/utils/helpers';
import { ExperienceBcDto } from './dto/experience-bc.dto';

@Injectable()
export class ExperienceBcService {
    constructor(private readonly caService: CaService) {}

    /**
     * Store Experience data on BC
     *
     * @param {any} experienceData - Object of Experience Data
     * @param {string} userId - Logged in user Id
     * @param {string} payload - Value to be passed on payload to differentiate Create/Update
     *
     *
     **/

    async storeExperienceBC(experienceData: any, bcUserDto: BcUserDto, payload: string) {
        const logger = new Logger('StoreExperienceBC');
        try {
            // Experience Data type any to Experience BC Dto data
            const experienceBcData = await this.toExperienceBcDto(experienceData);
            // Creates hash value from required data
            const hashValue = await this.createHash(experienceBcData);
            const experienceId = experienceBcData._id;
            const bcRequestDto = new BcRequestDto();
            bcRequestDto.function = BC_CHAINCODE_FUNCTION.CREATE_EXPERIENCE;
            bcRequestDto.data = {
                experienceId: experienceId,
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
     * @param {any} experienceData - Object of experience data from mongodb
     * @param {string} userId - Unique Id of the logged in user
     *
     *
     **/
    async getBlockchainVerified(experienceData: any, bcUserDto: BcUserDto) {
        const logger = new Logger('GetBlockchainVerifiedExperience');
        let blockchainVerified = false;
        try {
            if (experienceData) {
                // Experience Data type of any to experience BC Dto data
                const experienceBcData = await this.toExperienceBcDto(experienceData);
                // Creates hash value from required data
                const hashValue = await this.createHash(experienceBcData);
                const experienceId = experienceBcData._id;
                const bcRequestDto = new BcRequestDto();
                bcRequestDto.function = BC_CHAINCODE_FUNCTION.GET_EXPERIENCE;
                bcRequestDto.data = {
                    experienceId: experienceId
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
     * @param {any} experienceList - List of experience from mongodb
     * @param {string} userId - Unique Id of the logged in user
     *
     *
     **/
    async getBlockchainVerifiedList(experienceList: any, bcUserDto: BcUserDto): Promise<any> {
        return await Promise.all(
            await experienceList.map(async (doc) => {
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
     * Get history from blockchain of specific key value
     *
     *
     * @param {string} userId - Unique Id of logged in user
     * @param {string} experienceId - Experience ID to check the history
     *
     *
     **/
    async getExperienceBlockchainHistory(bcUserDto: BcUserDto, experienceId: string) {
        const logger = new Logger('GetExperienceBlockchainHistory');
        try {
            const bcRequestDto = new BcRequestDto();
            bcRequestDto.function = BC_CHAINCODE_FUNCTION.GET_EXPERIENCE_HISTORY;
            bcRequestDto.data = {
                experienceId: experienceId
            };
            return await this.caService.getBlockchainHistory(bcUserDto, bcRequestDto);
        } catch (err) {
            logger.error(err);
            throw new HttpException(BC_ERROR_RESPONSE.FETCH_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Generate sha256 hash of the experience data
     *
     *
     * @param {ExperienceBcDto} experienceBcDto - Object of experience bc data for hashing
     * @return {Promise<string>} - Returns Promise of hashed hex string
     *
     *
     **/
    private async createHash(experienceBcDto: ExperienceBcDto): Promise<string> {
        return await sha256Hash(JSON.stringify(experienceBcDto));
    }

    /**
     * Map Data to Experience Bc Dto
     *
     *
     * @param {any} experienceData - Object of Experience for mapping to BC Dto
     * @return {Promise<ExperienceBcDto>} - Returns Promise of ExperienceBcDto
     *
     *
     **/
    private async toExperienceBcDto(experienceData: any): Promise<ExperienceBcDto> {
        const logger = new Logger('ToExperienceBcDto');
        try {
            const experienceBcDto = new ExperienceBcDto();
            experienceBcDto._id = experienceData._id;
            experienceBcDto.title = experienceData.title;
            experienceBcDto.employmentType = experienceData.employmentType;
            experienceBcDto.company = experienceData.company;
            experienceBcDto.location = experienceData.location;
            experienceBcDto.status = experienceData.status;
            experienceBcDto.userId = experienceData.userId;
            experienceBcDto.startDate = experienceData.startDate;
            experienceBcDto.endDate = experienceData.endDate;
            experienceBcDto.createdAt = experienceData.createdAt;
            experienceBcDto.updatedAt = experienceData.updatedAt;
            return experienceBcDto;
        } catch (err) {
            logger.error(err);
            throw new HttpException(COMMON_ERROR.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

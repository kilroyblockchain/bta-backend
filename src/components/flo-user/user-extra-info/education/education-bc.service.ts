import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { BcUserDto } from 'src/@core/common/bc-user.dto';
import { COMMON_ERROR } from 'src/@core/constants/api-error-constants';
import { BC_CHAINCODE_FUNCTION } from 'src/@core/constants/bc-constants/bc-chaincode-function.constant';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { BcRequestDto } from 'src/@core/constants/dto/bc-request.dto';
import { CaService } from 'src/components/certificate-authority/ca-client.service';
import { sha256Hash } from 'src/components/utils/helpers';
import { EducationBcDto } from './dto/education-bc.dto';

@Injectable()
export class EducationBcService {
    constructor(private readonly caService: CaService) {}

    /**
     * Store Education data on BC
     *
     * @param {any} educationData - Object of Education Data
     * @param {string} userId - Logged in user Id
     * @param {string} payload - Value to be passed on payload to differentiate Create/Update
     *
     *
     **/

    async storeEducationBC(educationData: any, bcUserDto: BcUserDto, payload: string) {
        const logger = new Logger('StoreEducationBC');
        try {
            // Education Data type any to Education BC Dto data
            const educationBcData = await this.toEducationBcDto(educationData);
            // Creates hash value from required data
            const hashValue = await this.createHash(educationBcData);
            const educationId = educationBcData._id;
            const bcRequestDto = new BcRequestDto();
            bcRequestDto.function = BC_CHAINCODE_FUNCTION.CREATE_EDUCATION;
            bcRequestDto.data = {
                educationId: educationId,
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
     * @param {any} educationData - Object of education data from mongodb
     * @param {string} userId - Unique Id of the logged in user
     *
     *
     **/
    async getBlockchainVerified(educationData: any, bcUserDto: BcUserDto) {
        const logger = new Logger('GetBlockchainVerifiedEducation');
        let blockchainVerified = false;
        try {
            if (educationData) {
                // Education Data type of any to education BC Dto data
                const educationBcData = await this.toEducationBcDto(educationData);
                // Creates hash value from required data
                const hashValue = await this.createHash(educationBcData);
                const educationId = educationBcData._id;
                const bcRequestDto = new BcRequestDto();
                bcRequestDto.function = BC_CHAINCODE_FUNCTION.GET_EDUCATION;
                bcRequestDto.data = {
                    educationId: educationId
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
     * @param {any} educationList - List of education from mongodb
     * @param {string} userId - Unique Id of the logged in user
     *
     *
     **/
    async getBlockchainVerifiedList(educationList: any, bcUserDto: BcUserDto): Promise<any> {
        return await Promise.all(
            await educationList.map(async (doc) => {
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
     * Get all the state data from blockchain (history) of particular education
     *
     *
     * @param {string} userId - Unique Id of the logged in user
     * @param {string} educationId - Id of the education to get the history from blockchain
     *
     *
     **/
    async getEducationBcHistory(bcUserDto: BcUserDto, educationId: string): Promise<any> {
        const logger = new Logger('GetEducationBcHistory');
        try {
            const bcRequestDto = new BcRequestDto();
            bcRequestDto.function = BC_CHAINCODE_FUNCTION.GET_EDUCATION_HISTORY;
            bcRequestDto.data = {
                educationId: educationId
            };
            return await this.caService.getBlockchainHistory(bcUserDto, bcRequestDto);
        } catch (err) {
            logger.error(err);
            throw new HttpException(BC_ERROR_RESPONSE.FETCH_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Generate sha256 hash of the education data
     *
     *
     * @param {EducationBcDto} educationBcDto - Object of education bc data for hashing
     * @return {Promise<string>} - Returns Promise of hashed hex string
     *
     *
     **/
    private async createHash(educationBcDto: EducationBcDto): Promise<string> {
        return await sha256Hash(JSON.stringify(educationBcDto));
    }

    /**
     * Map Data to Education Bc Dto
     *
     *
     * @param {any} educationData - Object of Education for mapping to BC Dto
     * @return {Promise<EducationBcDto>} - Returns Promise of EducationBcDto
     *
     *
     **/
    private async toEducationBcDto(educationData: any): Promise<EducationBcDto> {
        const logger = new Logger('ToEducationBcDto');
        try {
            const educationBcDto = new EducationBcDto();
            educationBcDto._id = educationData._id;
            educationBcDto.userId = educationData.userId;
            educationBcDto.school = educationData.school;
            educationBcDto.degree = educationData.degree;
            educationBcDto.fieldOfStudy = educationData.fieldOfStudy;
            educationBcDto.grade = educationData.grade;
            educationBcDto.startYear = educationData.startYear;
            educationBcDto.endYear = educationData.endYear;
            educationBcDto.status = educationData.status;
            educationBcDto.createdAt = educationData.createdAt;
            educationBcDto.updatedAt = educationData.updatedAt;
            return educationBcDto;
        } catch (err) {
            logger.error(err);
            throw new HttpException(COMMON_ERROR.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

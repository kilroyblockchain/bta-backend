import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { BcUserDto } from 'src/@core/common/bc-user.dto';
import { COMMON_ERROR } from 'src/@core/constants/api-error-constants';
import { BC_CHAINCODE_FUNCTION } from 'src/@core/constants/bc-constants/bc-chaincode-function.constant';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { BcRequestDto } from 'src/@core/constants/dto/bc-request.dto';
import { CaService } from 'src/components/certificate-authority/ca-client.service';
import { sha256Hash } from 'src/components/utils/helpers';
import { LanguageBcDto } from './dto/language-bc.dto';

@Injectable()
export class LanguageBcService {
    constructor(private readonly caService: CaService) {}

    /**
     * Store Language data on BC
     *
     * @param {any} languageData - Object of Language Data
     * @param {string} userId - Logged in user Id
     * @param {string} payload - Value to be passed on payload to differentiate Create/Update
     *
     *
     **/

    async storeLanguageBC(languageData: any, bcUserDto: BcUserDto, payload: string) {
        const logger = new Logger('StoreLanguageBC');
        try {
            // Language Data type any to Language BC Dto data
            const languageBcData = await this.toLanguageBcDto(languageData);
            // Creates hash value from required data
            const hashValue = await this.createHash(languageBcData);
            const languageId = languageBcData._id;
            const bcRequestDto = new BcRequestDto();
            bcRequestDto.function = BC_CHAINCODE_FUNCTION.CREATE_LANGUAGE;
            bcRequestDto.data = {
                languageId: languageId,
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
     * @param {any} languageData - Object of language data from mongodb
     * @param {string} userId - Unique Id of the logged in user
     *
     *
     **/
    async getBlockchainVerified(languageData: any, bcUserDto: BcUserDto) {
        const logger = new Logger('GetBlockchainVerifiedLanguage');
        let blockchainVerified = false;
        try {
            if (languageData) {
                // Language Data type of any to language BC Dto data
                const languageBcData = await this.toLanguageBcDto(languageData);
                // Creates hash value from required data
                const hashValue = await this.createHash(languageBcData);
                const languageId = languageBcData._id;
                const bcRequestDto = new BcRequestDto();
                bcRequestDto.function = BC_CHAINCODE_FUNCTION.GET_LANGUAGE;
                bcRequestDto.data = {
                    languageId: languageId
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
     * @param {any} languageList - List of language from mongodb
     * @param {string} userId - Unique Id of the logged in user
     *
     *
     **/
    async getBlockchainVerifiedList(languageList: any, bcUserDto: BcUserDto): Promise<any> {
        return await Promise.all(
            await languageList.map(async (doc) => {
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
     * Get all the state data from blockchain (history) of particular language
     *
     *
     * @param {string} userId - Unique Id of the logged in user
     * @param {string} languageId - Id of the language to get the history from blockchain
     *
     *
     **/
    async getLanguageBcHistory(bcUserDto: BcUserDto, languageId: string): Promise<any> {
        const logger = new Logger('GetLanguageBcHistory');
        try {
            const bcRequestDto = new BcRequestDto();
            bcRequestDto.function = BC_CHAINCODE_FUNCTION.GET_LANGUAGE_HISTORY;
            bcRequestDto.data = {
                languageId: languageId
            };
            return await this.caService.getBlockchainHistory(bcUserDto, bcRequestDto);
        } catch (err) {
            logger.error(err);
            throw new HttpException(BC_ERROR_RESPONSE.FETCH_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Generate sha256 hash of the language data
     *
     *
     * @param {LanguageBcDto} languageBcDto - Object of language bc data for hashing
     * @return {Promise<string>} - Returns Promise of hashed hex string
     *
     *
     **/
    private async createHash(languageBcDto: LanguageBcDto): Promise<string> {
        return await sha256Hash(JSON.stringify(languageBcDto));
    }

    /**
     * Map Data to Language Bc Dto
     *
     *
     * @param {any} languageData - Object of Language for mapping to BC Dto
     * @return {Promise<LanguageBcDto>} - Returns Promise of LanguageBcDto
     *
     *
     **/
    private async toLanguageBcDto(languageData: any): Promise<LanguageBcDto> {
        const logger = new Logger('ToLanguageBcDto');
        try {
            const languageBcDto = new LanguageBcDto();
            languageBcDto._id = languageData._id;
            languageBcDto.title = languageData.title;
            languageBcDto.status = languageData.status;
            languageBcDto.createdBy = languageData.createdBy;
            languageBcDto.createdAt = languageData.createdAt;
            languageBcDto.updatedAt = languageData.updatedAt;
            return languageBcDto;
        } catch (err) {
            logger.error(err);
            throw new HttpException(COMMON_ERROR.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

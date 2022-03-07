import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { BcUserDto } from 'src/@core/common/bc-user.dto';
import { COMMON_ERROR } from 'src/@core/constants/api-error-constants';
import { BC_CHAINCODE_FUNCTION } from 'src/@core/constants/bc-constants/bc-chaincode-function.constant';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { BcRequestDto } from 'src/@core/constants/dto/bc-request.dto';
import { CaService } from 'src/components/certificate-authority/ca-client.service';
import { sha256Hash } from 'src/components/utils/helpers';
import { SkillBcDto } from './dto/skill-bc.dto';

@Injectable()
export class SkillBcService {
    constructor(private readonly caService: CaService) {}

    /**
     * Store Skill data on BC
     *
     * @param {any} skillData - Object of Skill Data
     * @param {string} userId - Logged in user Id
     * @param {string} payload - Value to be passed on payload to differentiate Create/Update
     *
     *
     **/

    async storeSkillBC(skillData: any, bcUserDto: BcUserDto, payload: string) {
        const logger = new Logger('StoreSkillBC');
        try {
            // Skill Data type any to Skill BC Dto data
            const skillBcData = await this.toSkillBcDto(skillData);
            // Creates hash value from required data
            const hashValue = await this.createHash(skillBcData);
            const skillId = skillBcData._id;
            const bcRequestDto = new BcRequestDto();
            bcRequestDto.function = BC_CHAINCODE_FUNCTION.CREATE_SKILL;
            bcRequestDto.data = {
                skillsId: skillId,
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
     * @param {any} skillData - Object of skill data from mongodb
     * @param {string} userId - Unique Id of the logged in user
     *
     *
     **/
    async getBlockchainVerified(skillData: any, bcUserDto: BcUserDto) {
        const logger = new Logger('GetBlockchainVerifiedSkill');
        let blockchainVerified = false;
        try {
            if (skillData) {
                // Skill Data type of any to skill BC Dto data
                const skillBcData = await this.toSkillBcDto(skillData);
                // Creates hash value from required data
                const hashValue = await this.createHash(skillBcData);
                const skillId = skillBcData._id;
                const bcRequestDto = new BcRequestDto();
                bcRequestDto.function = BC_CHAINCODE_FUNCTION.GET_SKILL;
                bcRequestDto.data = {
                    skillsId: skillId
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
     * @param {any} skillList - List of skill from mongodb
     * @param {string} userId - Unique Id of the logged in user
     *
     *
     **/
    async getBlockchainVerifiedList(skillList: any, bcUserDto: BcUserDto): Promise<any> {
        return await Promise.all(
            await skillList.map(async (doc) => {
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
     * Get all the state data from blockchain (history) of particular skill
     *
     *
     * @param {string} userId - Unique Id of the logged in user
     * @param {string} skillId - Id of the skill to get the history from blockchain
     *
     *
     **/
    async getSkillBcHistory(bcUserDto: BcUserDto, skillId: string): Promise<any> {
        const logger = new Logger('GetSkillBcHistory');
        try {
            const bcRequestDto = new BcRequestDto();
            bcRequestDto.function = BC_CHAINCODE_FUNCTION.GET_SKILL_HISTORY;
            bcRequestDto.data = {
                skillsId: skillId
            };
            return await this.caService.getBlockchainHistory(bcUserDto, bcRequestDto);
        } catch (err) {
            logger.error(err);
            throw new HttpException(BC_ERROR_RESPONSE.FETCH_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Generate sha256 hash of the skill data
     *
     *
     * @param {SkillBcDto} skillBcDto - Object of skill bc data for hashing
     * @return {Promise<string>} - Returns Promise of hashed hex string
     *
     *
     **/
    private async createHash(skillBcDto: SkillBcDto): Promise<string> {
        return await sha256Hash(JSON.stringify(skillBcDto));
    }

    /**
     * Map Data to Skill Bc Dto
     *
     *
     * @param {any} skillData - Object of Skill for mapping to BC Dto
     * @return {Promise<SkillBcDto>} - Returns Promise of SkillBcDto
     *
     *
     **/
    private async toSkillBcDto(skillData: any): Promise<SkillBcDto> {
        const logger = new Logger('ToSkillBcDto');
        try {
            const skillBcDto = new SkillBcDto();
            skillBcDto._id = skillData._id;
            skillBcDto.title = skillData.title;
            skillBcDto.status = skillData.status;
            skillBcDto.createdBy = skillData.createdBy;
            skillBcDto.createdAt = skillData.createdAt;
            skillBcDto.updatedAt = skillData.updatedAt;
            return skillBcDto;
        } catch (err) {
            logger.error(err);
            throw new HttpException(COMMON_ERROR.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

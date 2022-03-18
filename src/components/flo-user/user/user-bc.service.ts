import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { BcUserDto } from 'src/@core/common/bc-user.dto';
import { BC_CHAINCODE_FUNCTION } from 'src/@core/constants/bc-constants/bc-chaincode-function.constant';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { BcRequestDto } from 'src/@core/constants/dto/bc-request.dto';
import { CaService } from 'src/components/certificate-authority/ca-client.service';
import { sha256Hash } from 'src/components/utils/helpers';
import { UserBcDto } from './dto/user-bc.dto';

@Injectable()
export class UserBcService {
    constructor(private readonly caService: CaService) {}

    async storeUserBc(userRes: any, bcUserDto: BcUserDto, payload: string): Promise<boolean> {
        const logger = new Logger('StoreUserBc');
        try {
            // User Data type any to Education BC Dto data
            const educationBcData = await this.toUserBcDto(userRes);
            // Creates hash value from required data
            const hashValue = await this.createHash(educationBcData);
            const bcRequestDto = new BcRequestDto();
            bcRequestDto.function = BC_CHAINCODE_FUNCTION.CREATE_USER;
            bcRequestDto.data = {
                userId: educationBcData._id,
                hash: hashValue,
                payload: payload
            };
            await this.caService.createEntry(bcRequestDto, bcUserDto);
            return true;
        } catch (err) {
            logger.error(err);
            throw new HttpException(BC_ERROR_RESPONSE.FETCH_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getBlockchainVerifiedUser(userData: any, bcUserDto: BcUserDto): Promise<boolean> {
        const logger = new Logger('GetUserBc');
        let blockchainVerified = false;
        try {
            if (userData) {
                // User Data type any to User BC Dto data
                const userBcData = await this.toUserBcDto(userData);
                // Creates hash value from required data
                const hashValue = await this.createHash(userBcData);
                const bcRequestDto = new BcRequestDto();
                bcRequestDto.function = BC_CHAINCODE_FUNCTION.GET_USER;
                bcRequestDto.data = {
                    userId: userBcData._id
                };
                blockchainVerified = await this.caService.getBlockchainVerified(hashValue, bcRequestDto, bcUserDto);
            }
            return blockchainVerified;
        } catch (err) {
            logger.error(err);
            throw new HttpException(BC_ERROR_RESPONSE.FETCH_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getBlockchainVerifiedUserList(userList: any, bcUserDto: BcUserDto): Promise<any> {
        let responses = null;
        responses = await Promise.all(
            await userList.map(async (doc) => {
                const blockchainVerified = await this.getBlockchainVerifiedUser(doc, bcUserDto);
                if ('_doc' in doc) {
                    return { ...doc._doc, blockchainVerified };
                } else {
                    return { ...doc, blockchainVerified };
                }
            })
        );
        return responses;
    }

    async getBlockchainVerifiedTraineeUserList(userList: any, bcUserDto: BcUserDto): Promise<any> {
        let responses = null;
        responses = await Promise.all(
            await userList.map(async (doc) => {
                const blockchainVerified = await this.getBlockchainVerifiedUser(doc.trainee, bcUserDto);
                if ('_doc' in doc) {
                    return { ...doc._doc, blockchainVerified };
                } else {
                    return { ...doc, blockchainVerified };
                }
            })
        );
        return responses;
    }

    private async createHash(userBcDto: UserBcDto): Promise<string> {
        return await sha256Hash(JSON.stringify(userBcDto));
    }

    private async toUserBcDto(userData: any): Promise<UserBcDto> {
        const companyIdList = [];
        const skillIdList = [];
        const languageIdList = [];
        const educationIdList = [];
        const experienceIdList = [];
        if (userData.company && userData.experience && userData.skill && userData.language && userData.education) {
            await Promise.all([
                userData.company.map((company) => {
                    companyIdList.push(company._id);
                }),
                userData.skill.map((skill) => {
                    skillIdList.push(skill._id);
                }),
                userData.language.map((language) => {
                    languageIdList.push(language._id);
                }),
                userData.education.map((education) => {
                    educationIdList.push(education._id);
                }),
                userData.experience.map((experience) => {
                    experienceIdList.push(experience._id);
                })
            ]);
        }

        const userBcDto = new UserBcDto();
        userBcDto._id = userData._id;
        userBcDto.firstName = userData.firstName;
        userBcDto.lastName = userData.lastName;
        userBcDto.phone = userData.phone;
        userBcDto.email = userData.email;
        userBcDto.country = userData.country == null ? null : userData.country._id;
        userBcDto.state = userData.state == null ? null : userData.state._id;
        userBcDto.address = userData.address;
        userBcDto.zipCode = userData.zipCode;
        userBcDto.company = companyIdList;
        userBcDto.skill = skillIdList;
        userBcDto.language = languageIdList;
        userBcDto.education = educationIdList;
        userBcDto.experience = experienceIdList;
        return userBcDto;
    }

    async registerUser(bcUserDto: BcUserDto, staffingId: string, organizationId?: string, channelId?: string): Promise<void> {
        const logger = new Logger('BcRegisterUser');
        try {
            await this.caService.userRegistration(bcUserDto, staffingId, organizationId, channelId);
        } catch (err) {
            logger.error(err);
        }
    }
}

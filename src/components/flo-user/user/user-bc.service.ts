import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { BcUserDto } from 'src/@core/common/bc-user.dto';
import { BC_CHAINCODE_FUNCTION } from 'src/@core/constants/bc-constants/bc-chaincode-function.constant';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { BcRequestDto } from 'src/@core/constants/dto/bc-request.dto';
import { CaService } from 'src/components/certificate-authority/ca-client.service';
import { sha256Hash } from 'src/components/utils/helpers';
import { UserBcDto } from './dto/user-bc.dto';
import { IUserBc } from './interfaces/user.interface';

@Injectable()
export class UserBcService {
    constructor(private readonly caService: CaService) {}

    async storeUserBc(userRes: IUserBc, bcUserDto: BcUserDto, payload: string): Promise<boolean> {
        const logger = new Logger('StoreUserBc');
        try {
            // User Data type IUserBc to User BC Dto data
            const userBcData = await this.toUserBcDto(userRes);
            // Creates hash value from required data
            const hashValue = await this.createHash(userBcData);
            const bcRequestDto = new BcRequestDto();
            bcRequestDto.function = BC_CHAINCODE_FUNCTION.CREATE_USER;
            bcRequestDto.data = {
                userId: userBcData._id,
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

    async getBlockchainVerifiedUser(userData: IUserBc, bcUserDto: BcUserDto): Promise<boolean> {
        const logger = new Logger('GetUserBc');
        let blockchainVerified = false;
        try {
            if (userData) {
                // User Data type IUserBc to User BC Dto data
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

    async getBlockchainVerifiedUserList(userList: IUserBc[], bcUserDto: BcUserDto): Promise<IUserBc[]> {
        return await Promise.all(
            await userList.map(async (user) => {
                const blockchainVerified = await this.getBlockchainVerifiedUser(user, bcUserDto);
                user.blockchainVerified = blockchainVerified;
                return user;
            })
        );
    }

    private async createHash(userBcDto: UserBcDto): Promise<string> {
        return await sha256Hash(JSON.stringify(userBcDto));
    }

    private async toUserBcDto(userData: IUserBc): Promise<UserBcDto> {
        const companyIdList = [];
        if (userData.company) {
            await Promise.all([
                userData.company.map((company) => {
                    companyIdList.push(company._id);
                })
            ]);
        }
        const userBcDto = new UserBcDto();
        userBcDto._id = userData._id;
        userBcDto.firstName = userData.firstName;
        userBcDto.lastName = userData.lastName;
        userBcDto.phone = userData.phone;
        userBcDto.email = userData.email;
        userBcDto.country = userData.country == null ? null : userData.country['_id'];
        userBcDto.state = userData.state == null ? null : userData.state['_id'];
        userBcDto.address = userData.address;
        userBcDto.zipCode = userData.zipCode;
        userBcDto.company = companyIdList;
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

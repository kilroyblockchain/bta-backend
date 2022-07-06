import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { BcConnectionService } from 'src/components/blockchain/bc-connection/bc-connection.service';
import { BcTransactionInfoDto } from 'src/components/blockchain/bc-connection/dto/bc-transaction-info.dto';
import { IRegisterBcUserResponse } from 'src/components/blockchain/bc-connection/interface/register-bc-user-response.interface';
import { BcNodeInfoService } from 'src/components/blockchain/bc-node-info/bc-node-info.service';
import { RegisterBcUserDto } from './dto/register-bc-user.dto';

@Injectable()
export class UserBcService {
    constructor(private readonly bcConnectionService: BcConnectionService, private readonly bcNodeInfoService: BcNodeInfoService) {}

    /**
     * Register SuperAdmin User on multiple nodes. Function fetches all the BC node list and then registers super admin user on every nodes.
     *
     * @param {RegisterBcUserDto} registerBcUserDto - Object of RegisterBcUserDto, Pass userId and email of the user
     * @returns {Promise<IRegisterBcUserResponse>} - Returns Promise of IRegisterBcUserResponse Detail
     *
     **/
    async registerSuperAdminToMultiOrg(registerBcUserDto: RegisterBcUserDto): Promise<IRegisterBcUserResponse> {
        const logger = new Logger(UserBcService.name + '-registerSuperAdminToMultiOrg');
        try {
            const bcNodeInfoList = await this.bcNodeInfoService.getAllBcNodeInfo();
            let registerBcUserResponse: IRegisterBcUserResponse;
            for (const bcNodeInfo of bcNodeInfoList.docs) {
                registerBcUserResponse = await this.bcConnectionService.registerSuperAdminUser(registerBcUserDto, bcNodeInfo);
            }
            return registerBcUserResponse;
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
            throw new BadRequestException([BC_ERROR_RESPONSE.USER_REGISTRATION_FAILED], err);
        }
    }

    /**
     * Register SuperAdmin User on multiple nodes. Function fetches all the BC node list and then registers super admin user on every nodes.
     *
     * @param {RegisterBcUserDto} registerBcUserDto - Object of RegisterBcUserDto, Pass userId and email of the user
     * @param {IBcNodeInfo} bcNodeInfo - Object of IBcNodeInfo, Pass userId and email of the user
     * @returns {Promise<IRegisterBcUserResponse>} - Returns Promise of IRegisterBcUserResponse Detail
     *
     **/
    async registerUser(registerBcUserDto: RegisterBcUserDto, bcTransactionInfo: BcTransactionInfoDto, bcNodeInfoId: string): Promise<IRegisterBcUserResponse> {
        const logger = new Logger(UserBcService.name + '-registerUser');
        try {
            const bcNodeInfo = await this.bcNodeInfoService.getBcNodeInfoById(bcNodeInfoId);
            const registerBcUserResponse = await this.bcConnectionService.registerUser(registerBcUserDto, bcNodeInfo, bcTransactionInfo);
            return registerBcUserResponse;
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
            throw new BadRequestException([BC_ERROR_RESPONSE.USER_REGISTRATION_FAILED], err);
        }
    }
}

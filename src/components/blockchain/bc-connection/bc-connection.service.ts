import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { BcRequestDto } from 'src/@core/constants/dto/bc-request.dto';
import axios, { AxiosError } from 'axios';
import { BC_CONNECTION_API } from 'src/@core/constants/bc-constants/bc-connection.api.constant';
import { BcConnectionDto } from './dto/bc-connection.dto';
import { CreateBcNodeInfoDto } from '../bc-node-info/dto/create-bc-node-info.dto';
import { BcUserAuthenticationDto } from '../dto/bc-user-authentication.dto';
import { RegisterBcUserDto } from 'src/components/app-user/user/dto/register-bc-user.dto';
import { IBcNodeInfo } from '../bc-node-info/interfaces/bc-node-info.interface';
import { IRegisterBcUserResponse } from './interface/register-bc-user-response.interface';

const BC_CONNECTION_HOST = process.env.BC_CONNECTION_HOST;
const AUTHORIZATION_TOKEN = process.env.AUTHORIZATION_TOKEN;

@Injectable()
export class BcConnectionService {
    async invoke(bcRequestDto: BcRequestDto, userId: string): Promise<BcConnectionDto> {
        const logger = new Logger('BcConnectionInvoke');
        try {
            const response = await axios.post(BC_CONNECTION_HOST + BC_CONNECTION_API.INVOKE_BC, bcRequestDto, {
                headers: {
                    'Content-Type': 'application/json',
                    user_id: userId,
                    authorization: 'Basic ' + AUTHORIZATION_TOKEN
                }
            });
            return new BcConnectionDto(response.data);
        } catch (error) {
            if (error.status) {
                logger.error(error);
                throw error;
            }
            const err = error as AxiosError;
            logger.error(err.response ? JSON.stringify(err.response.data) : err);
            if (err.response && err.response.status == HttpStatus.CONFLICT && err.response.data) {
                throw new HttpException(err.response.data, err.response.status);
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async query(bcRequestDto: BcRequestDto, userId: string): Promise<BcConnectionDto> {
        const logger = new Logger('BcConnectionQuery');
        try {
            const response = await axios.post(BC_CONNECTION_HOST + BC_CONNECTION_API.QUERY_BC, bcRequestDto, {
                headers: {
                    'Content-Type': 'application/json',
                    user_id: userId,
                    authorization: 'Basic ' + AUTHORIZATION_TOKEN
                }
            });
            return new BcConnectionDto(response.data.data);
        } catch (error) {
            logger.error(error);
            const err = error as AxiosError;
            logger.error(err.response ? JSON.stringify(err.response.data) : err);
            throw err;
        }
    }

    async registerUser(registerBcUserDto: RegisterBcUserDto, orgName: string, loggedInUserKey: string, channelName: string, loggedInUserSalt: string, bcNodeUrl: string, authorizationToken: string): Promise<IRegisterBcUserResponse> {
        const logger = new Logger('BcRegisterUser');
        try {
            const response = await axios.post(bcNodeUrl + BC_CONNECTION_API.REGISTER_USER, registerBcUserDto, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: authorizationToken,
                    key: loggedInUserKey,
                    salt: loggedInUserSalt,
                    channel_name: channelName,
                    org_name: orgName
                }
            });
            const registerUserData: IRegisterBcUserResponse = response.data.data;
            return new IRegisterBcUserResponse(registerUserData.key, registerUserData.salt);
        } catch (error) {
            logger.error(error);
            const err = error as AxiosError;
            console.log('ERR===>', err.response.data);
            if (err.response) {
                logger.error(JSON.stringify(err.response.data));
                throw err.response.data;
            }
            logger.error(err);
            throw err;
        }
    }

    async activateUser(userId: string): Promise<BcConnectionDto> {
        const logger = new Logger('BcActivateUser');
        try {
            const response = await axios.get(BC_CONNECTION_HOST + BC_CONNECTION_API.ACTIVATE_USER + '/' + userId, {
                headers: {
                    authorization: 'Basic ' + AUTHORIZATION_TOKEN
                }
            });
            return new BcConnectionDto(response.data);
        } catch (error) {
            logger.error(error);
            const err = error as AxiosError;
            logger.error(err.response ? JSON.stringify(err.response.data) : err);
            throw err;
        }
    }

    async deactivateUser(userId: string): Promise<BcConnectionDto> {
        const logger = new Logger('BcDeactivateUser');
        try {
            const response = await axios.get(BC_CONNECTION_HOST + BC_CONNECTION_API.DEACTIVATE_USER + '/' + userId, {
                headers: {
                    authorization: 'Basic ' + AUTHORIZATION_TOKEN
                }
            });
            return new BcConnectionDto(response.data);
        } catch (error) {
            logger.error(error);
            const err = error as AxiosError;
            logger.error(err.response ? JSON.stringify(err.response.data) : err);
            throw err;
        }
    }

    async checkUser(userId: string): Promise<BcConnectionDto> {
        const logger = new Logger('BcCheckUser');
        try {
            const response = await axios.get(BC_CONNECTION_HOST + BC_CONNECTION_API.CHECK_USER + '/' + userId, {
                headers: {
                    authorization: 'Basic ' + AUTHORIZATION_TOKEN
                }
            });
            return new BcConnectionDto(response.data);
        } catch (error) {
            logger.error(error);
            const err = error as AxiosError;
            logger.error(err.response ? JSON.stringify(err.response.data) : err);
            throw err;
        }
    }

    async checkBcNodeConnection(bcNodeInfo: CreateBcNodeInfoDto, bcUserAuthenticationDto: BcUserAuthenticationDto): Promise<BcConnectionDto> {
        const logger = new Logger('CheckBcNodeConnection');
        try {
            const response = await axios.get(bcNodeInfo.nodeUrl + BC_CONNECTION_API.CHECK_BC_NODE_CONNECTION, {
                headers: {
                    authorization: 'Basic ' + bcNodeInfo.authorizationToken,
                    key: bcUserAuthenticationDto.key,
                    salt: bcUserAuthenticationDto.salt,
                    channel_name: 'default',
                    org_name: bcNodeInfo.orgName
                },
                timeout: 2000
            });
            return new BcConnectionDto(response.data);
        } catch (error) {
            logger.error(error);
            const err = error as AxiosError;
            logger.error(err.response ? JSON.stringify(err.response.data) : err);
            throw err;
        }
    }

    async registerSuperAdminUser(registerBcUserDto: RegisterBcUserDto, bcNodeInfo: IBcNodeInfo): Promise<IRegisterBcUserResponse> {
        const logger = new Logger('BcRegisterUser');
        try {
            console.log('FULL URL===>', bcNodeInfo.nodeUrl + BC_CONNECTION_API.REGISTER_SUPER_ADMIN_USER);
            const response = await axios.post(bcNodeInfo.nodeUrl + BC_CONNECTION_API.REGISTER_SUPER_ADMIN_USER, registerBcUserDto, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Basic ' + bcNodeInfo.authorizationToken,
                    admin_id: process.env.BC_CONNECTOR_ADMIN_ID,
                    org_name: bcNodeInfo.orgName
                }
            });
            const registerUserData: IRegisterBcUserResponse = response.data.data;
            return new IRegisterBcUserResponse(registerUserData.key, registerUserData.salt);
        } catch (error) {
            logger.error(error);
            const err = error as AxiosError;
            if (err.response) {
                logger.error(JSON.stringify(err.response.data));
                throw err.response.data;
            }
            logger.error(err);
            throw err;
        }
    }
}

import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { BcRequestDto } from 'src/@core/constants/dto/bc-request.dto';
import axios, { AxiosError } from 'axios';
import { BC_CONNECTION_API } from 'src/@core/constants/bc-constants/bc-connection.api.constant';
import { BcConnectionDto } from './dto/bc-connection.dto';

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

    async registerUser(userId: string, registrar: string, superAdmin?: boolean): Promise<BcConnectionDto> {
        const logger = new Logger('BcRegisterUser');
        const registerUserRequest = {
            userName: userId
        };
        let registerUserAPI = BC_CONNECTION_API.REGISTER_USER;
        if (superAdmin) {
            registerUserAPI = BC_CONNECTION_API.REGISTER_SUPER_ADMIN_USER;
        } else {
        }
        try {
            const response = await axios.post(BC_CONNECTION_HOST + registerUserAPI, registerUserRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    user_id: registrar,
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
}

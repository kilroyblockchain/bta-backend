import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { OCConnectorResponseDto } from './dto/oc-connector-response.dto';

const OC_CONNECTION_HOST = process.env.OC_CONNECTION_HOST;
const AUTHORIZATION_TOKEN = process.env.AUTHORIZATION_TOKEN;

@Injectable()
export class OCConnectorService {
    async get(api: string): Promise<OCConnectorResponseDto> {
        const logger = new Logger('OCConnectorPost');
        try {
            const response = await axios.get(OC_CONNECTION_HOST + api, {
                headers: {
                    authorization: 'Basic ' + AUTHORIZATION_TOKEN
                }
            });
            return new OCConnectorResponseDto(response.data.message, response.data.data, response.data.statusCode);
        } catch (error) {
            if (error.status) {
                logger.error(error);
                throw error;
            }
            const err = error as AxiosError;
            logger.error(err.response ? JSON.stringify(err.response.data) : err);
            if (err.response && err.response.status == HttpStatus.CONFLICT) {
                throw new HttpException(err.response.data.detail, err.response.status);
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async post(request: any, api: string): Promise<OCConnectorResponseDto> {
        const logger = new Logger('OCConnectorPost');
        try {
            const response = await axios.post(OC_CONNECTION_HOST + api, request, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Basic ' + AUTHORIZATION_TOKEN
                }
            });
            return new OCConnectorResponseDto(response.data.message, response.data.data, response.data.statusCode);
        } catch (error) {
            if (error.status) {
                logger.error(error);
                throw error;
            }
            const err = error as AxiosError;
            logger.error(err.response ? JSON.stringify(err.response.data) : err);
            if (err.response && err.response.status == HttpStatus.CONFLICT) {
                throw new HttpException(err.response.data, err.response.status);
            } else if (err.response && err.response.status == HttpStatus.NOT_FOUND) {
                throw new HttpException(err.response.data.message, err.response.status);
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}

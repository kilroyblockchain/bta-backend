import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { OC_CONNECTION_API } from 'src/@core/constants/bc-constants/oc-connection.api.constant';
import { OCConnectorService } from '../oc-connector/oc-connector.service';
import { OCUserRegisterDto } from './dto/oc-user-register.dto';

@Injectable()
export class OCUserService {
    constructor(private readonly ocConnectorService: OCConnectorService) {}

    async registerUser(ocUserRegisterDto: OCUserRegisterDto): Promise<void> {
        try {
            ocUserRegisterDto.password = 'Test@1234';
            await this.ocConnectorService.post(ocUserRegisterDto, OC_CONNECTION_API.REGISTER_USER);
        } catch (err) {
            if (err.status == HttpStatus.CONFLICT) {
                throw new ConflictException(['User with the same email already exists']);
            }
        }
    }
}

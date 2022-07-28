import { BadRequestException, ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { OC_CONNECTION_API } from 'src/@core/constants/bc-constants/oc-connection.api.constant';
import { OCConnectorService } from '../oc-connector/oc-connector.service';
import { OCGroupService } from '../oc-group/oc-group.service';
import { OCUserRegisterDto } from './dto/oc-user-register.dto';

@Injectable()
export class OCUserService {
    constructor(private readonly ocConnectorService: OCConnectorService, private readonly ocGroupService: OCGroupService) {}

    async registerUser(ocUserRegisterDto: OCUserRegisterDto): Promise<void> {
        try {
            ocUserRegisterDto.password = 'Test@1234';
            const userRegister = await this.ocConnectorService.post(ocUserRegisterDto, OC_CONNECTION_API.REGISTER_USER);
            if (!userRegister) {
                throw new BadRequestException(['Unable to register user in oracle bucket cloud']);
            }

            const oracleGroupDto = {
                groupId: process.env.ORACLE_GROUP_ID,
                email: ocUserRegisterDto.email
            };

            await this.ocGroupService.addUserToGroup(oracleGroupDto);
        } catch (err) {
            if (err.status == HttpStatus.CONFLICT) {
                throw new ConflictException(['User with the same email already exists']);
            }
        }
    }
}

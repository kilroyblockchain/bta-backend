import { BadRequestException, ConflictException, forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { OC_CONNECTION_API } from 'src/@core/constants/bc-constants/oc-connection.api.constant';
import { UserService } from 'src/components/app-user/user/user.service';
import { OCConnectorService } from '../oc-connector/oc-connector.service';
import { OCGroupService } from '../oc-group/oc-group.service';
import { OCUserRegisterDto } from './dto/oc-user-register.dto';

@Injectable()
export class OCUserService {
    constructor(private readonly ocConnectorService: OCConnectorService, private readonly ocGroupService: OCGroupService, @Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

    async registerUser(ocUserRegisterDto: OCUserRegisterDto): Promise<void> {
        try {
            ocUserRegisterDto.password = 'Test@1234';
            const userRegister = await this.ocConnectorService.post(ocUserRegisterDto, OC_CONNECTION_API.REGISTER_USER);
            if (!userRegister) {
                throw new BadRequestException(['Unable to register user in oracle bucket cloud']);
            }

            const userOracleGroupName = await this.userService.getUserOracleGroupName(ocUserRegisterDto.email);
            const oracleGroupDto = {
                groupId: userOracleGroupName.company[0].staffingId[0]['oracleGroupName'],
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

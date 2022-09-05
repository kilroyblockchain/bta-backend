import { BadRequestException, ConflictException, forwardRef, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OC_CONSTANT } from 'src/@core/constants/api-error-constants';
import { OC_CONNECTION_API } from 'src/@core/constants/bc-constants/oc-connection.api.constant';
import { UserService } from 'src/components/app-user/user/user.service';
import { OCConnectorService } from '../oc-connector/oc-connector.service';
import { OCGroupDto } from '../oc-group/dto/oc-group.dto';
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
                throw new BadRequestException([OC_CONSTANT.UNABLE_TO_REGISTER_USER_IN_OC]);
            }

            const oracleGroup = await this.isOracleGroupExits(ocUserRegisterDto.oracleGroupName);
            if (!oracleGroup) throw new NotFoundException([OC_CONSTANT.ORACLE_GROUP_DOES_NOT_EXITS]);

            const oracleGroupDto = {
                groupId: oracleGroup.id,
                email: ocUserRegisterDto.email
            };

            await this.ocGroupService.addUserToGroup(oracleGroupDto);
        } catch (err) {
            if (err.status == HttpStatus.CONFLICT) {
                throw new ConflictException([OC_CONSTANT.USER_ALREADY_REGISTERED_WITH_THIS_EMAIL]);
            }
            throw err;
        }
    }

    async isOracleGroupExits(oracleGroupName: string): Promise<OCGroupDto> {
        const allOracleGroup = await this.ocGroupService.getAllGroupList();
        const group = allOracleGroup.find((f) => f.displayName === oracleGroupName);

        return group;
    }
}

import { Roles, Permission, Feature } from 'src/components/auth/decorators';
import { Controller, UseGuards, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Response as FLOResponse } from 'src/@core/response';
import { OC_CONSTANT } from 'src/@core/constants/api-error-constants/oc.constant';
import { OCUserService } from './oc-user.service';
import { OCUserRegisterDto } from './dto/oc-user-register.dto';

@ApiTags('OCGroup')
@Controller('oc-user')
export class OCUserController {
    constructor(private readonly ocUserService: OCUserService) {}

    @Post('register')
    @UseGuards(RolesGuard, PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.OC_GROUP)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Register User to Oracle Cloud' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async registerUser(@Body() ocUserRegisterDto: OCUserRegisterDto): Promise<FLOResponse> {
        return new FLOResponse(true, [OC_CONSTANT.USER_REGISTERED_SUCCESSFULLY]).setSuccessData(await this.ocUserService.registerUser(ocUserRegisterDto)).setStatus(HttpStatus.OK);
    }
}

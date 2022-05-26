import { Roles, Permission, Feature } from 'src/components/auth/decorators';
import { Controller, UseGuards, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Response as FLOResponse } from 'src/@core/response';
import { UserMappingService } from './user-mapping.service';
import { UserMappingAddDto } from './dto/user-mapping-add.dto';
import { USER_MAPPING_CONSTANT } from 'src/@core/constants/api-error-constants/user-mapping.constant';

@ApiTags('UserMapping')
@Controller('user-mapping')
export class UserMappingController {
    constructor(private readonly userMappingService: UserMappingService) {}

    @Post('create')
    @UseGuards(RolesGuard, PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.USER_MAPPING)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'A admins private route to create user mapping' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async createUserMapping(@Body() userMappingAddDto: UserMappingAddDto): Promise<FLOResponse> {
        return new FLOResponse(true, [USER_MAPPING_CONSTANT.USER_MAPPING_ADDED]).setSuccessData(await this.userMappingService.createUserMapping(userMappingAddDto)).setStatus(HttpStatus.OK);
    }
}

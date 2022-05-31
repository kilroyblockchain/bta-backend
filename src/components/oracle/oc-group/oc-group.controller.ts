import { Roles, Permission, Feature } from 'src/components/auth/decorators';
import { Controller, Get, UseGuards, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Response as FLOResponse } from 'src/@core/response';
import { OCGroupService } from './oc-group.service';
import { OCUserGroupAddDto } from './dto/oc-user-group-add.dto';
import { OC_CONSTANT } from 'src/@core/constants/api-error-constants/oc.constant';

@ApiTags('OCGroup')
@Controller('oc-group')
export class OCGroupController {
    constructor(private readonly ocGroupService: OCGroupService) {}

    @Get('all')
    @UseGuards(RolesGuard, PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.OC_GROUP)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'A private route for getting oracle group list' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async getAllGroup(): Promise<FLOResponse> {
        return new FLOResponse(true, [OC_CONSTANT.GROUP_LIST_FETCHED_SUCCESSFULLY]).setSuccessData(await this.ocGroupService.getAllGroupList()).setStatus(HttpStatus.OK);
    }

    @Post('add-user')
    @UseGuards(RolesGuard, PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.OC_GROUP)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Add User to Oracle Cloud Group' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async addUserToGroup(@Body() ocUserGroupAddDto: OCUserGroupAddDto): Promise<FLOResponse> {
        return new FLOResponse(true, [OC_CONSTANT.USER_ADDED_TO_GROUP]).setSuccessData(await this.ocGroupService.addUserToGroup(ocUserGroupAddDto)).setStatus(HttpStatus.OK);
    }
}

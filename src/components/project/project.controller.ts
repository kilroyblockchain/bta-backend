import { Roles, Permission, Feature } from 'src/components/auth/decorators';
import { Controller, UseGuards, HttpCode, HttpStatus, Post, Body, Get, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Response as FLOResponse } from 'src/@core/response';
import { ProjectService } from './project.service';
import { ProjectAddDto } from './dto/project-add.dto';
import { PROJECT_CONSTANT } from 'src/@core/constants/api-error-constants/project.constant';
import { Request } from 'express';

@ApiTags('Project')
@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post('create')
    @UseGuards(RolesGuard, PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.PROJECT)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Register User to Oracle Cloud' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async createProject(@Body() projectAddDto: ProjectAddDto): Promise<FLOResponse> {
        return new FLOResponse(true, [PROJECT_CONSTANT.PROJECT_CREATED]).setSuccessData(await this.projectService.createProject(projectAddDto)).setStatus(HttpStatus.OK);
    }

    @Get('all')
    @UseGuards(RolesGuard, PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.PROJECT)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'A admins private route to get all customer' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async findAllUser(@Req() req: Request): Promise<FLOResponse> {
        return new FLOResponse(true, [PROJECT_CONSTANT.PROJECT_LIST_FETCHED]).setSuccessData(await this.projectService.getAllProject(req)).setStatus(HttpStatus.OK);
    }
}

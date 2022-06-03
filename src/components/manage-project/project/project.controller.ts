import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { Response as FLOResponse } from 'src/@core/response';
import { AllProjectResponseDto, CreateProjectDto, ProjectResponseDto } from './dto';
import { PROJECT_CONSTANT } from 'src/@core/constants/api-error-constants';
import { PermissionGuard, RolesGuard } from 'src/components/auth/guards';
import { AuthGuard } from '@nestjs/passport';
import { Feature, Permission, Roles } from 'src/components/auth/decorators';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Request } from 'express';

@ApiTags('Project')
@UseGuards(RolesGuard)
@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.MANAGE_PROJECT)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Created New Project' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: PROJECT_CONSTANT.UNABLE_TO_CREATE_PROJECT })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: PROJECT_CONSTANT.PROJECT_NAME_CONFLICT })
    @ApiResponse({ status: HttpStatus.CREATED, type: ProjectResponseDto, description: PROJECT_CONSTANT.NEW_PROJECT_CREATED })
    async createProject(@Body() newProject: CreateProjectDto, @Req() req: Request): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [PROJECT_CONSTANT.NEW_PROJECT_CREATED]).setSuccessData(await this.projectService.createNewProject(newProject, req)).setStatus(HttpStatus.CREATED);
        } catch (err) {
            throw new BadRequestException(PROJECT_CONSTANT.UNABLE_TO_CREATE_PROJECT, err);
        }
    }

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.MANAGE_PROJECT)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Get all Projects' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.OK, type: AllProjectResponseDto, description: PROJECT_CONSTANT.ALL_PROJECT_RETRIEVED })
    async findAllUser(@Req() req: Request): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [PROJECT_CONSTANT.ALL_PROJECT_RETRIEVED]).setSuccessData(await this.projectService.getAllProject(req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND, err);
        }
    }

    @Put('update/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.MANAGE_PROJECT)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Update Project' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: PROJECT_CONSTANT.PROJECT_NAME_CONFLICT })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.OK, type: ProjectResponseDto, description: PROJECT_CONSTANT.PROJECT_RECORD_UPDATED })
    async updateProject(@Param('id') id: string, @Body() updateProject: CreateProjectDto): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [PROJECT_CONSTANT.PROJECT_RECORD_UPDATED]).setSuccessData(await this.projectService.updateProject(id, updateProject)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(PROJECT_CONSTANT.UNABLE_TO_UPDATE_PROJECT, err);
        }
    }
}

import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { Response as BTAResponse } from 'src/@core/response';
import { AddProjectPurposeDto, AllProjectResponseDto, CreateProjectDto, ProjectPurposeResponseDto, ProjectResponseDto, BCProjectResponseDto } from './dto';
import { PermissionGuard, RolesGuard } from 'src/components/auth/guards';
import { Feature, Permission, Roles } from 'src/components/auth/decorators';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE, MANAGE_PROJECT_CONSTANT } from 'src/@core/constants';
import { COMMON_ERROR } from 'src/@core/constants/api-error-constants';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { docsFileFilter, editFileName, purposeDocDestinationFolder } from 'src/@core/utils/file-upload.utils';
import { diskStorage } from 'multer';
import { MANAGE_PROJECT_BC_CONSTANT } from 'src/@core/constants/bc-constants/bc-manage-project.constant';
import { ProjectBcService } from './project-bc.service';

@ApiTags('Project')
@UseGuards(RolesGuard)
@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService, private readonly projectBcService: ProjectBcService) {}

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.PROJECT)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Created New Project' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_CREATE_PROJECT })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: MANAGE_PROJECT_CONSTANT.PROJECT_NAME_CONFLICT })
    @ApiResponse({ status: HttpStatus.CREATED, type: ProjectResponseDto, description: MANAGE_PROJECT_CONSTANT.NEW_PROJECT_CREATED })
    async createProject(@Body() newProject: CreateProjectDto, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.NEW_PROJECT_CREATED]).setSuccessData(await this.projectService.createNewProject(newProject, req)).setStatus(HttpStatus.CREATED);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_CREATE_PROJECT, err);
        }
    }

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.PROJECT)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Get all Projects' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.OK, type: AllProjectResponseDto, description: MANAGE_PROJECT_CONSTANT.ALL_PROJECT_RETRIEVED })
    async getAllProjects(@Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.ALL_PROJECT_RETRIEVED]).setSuccessData(await this.projectService.getAllProject(req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND, err);
        }
    }

    @Put('update/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.PROJECT)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Update Project' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: MANAGE_PROJECT_CONSTANT.PROJECT_NAME_CONFLICT })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.OK, type: ProjectResponseDto, description: MANAGE_PROJECT_CONSTANT.PROJECT_RECORD_UPDATED })
    async updateProject(@Param('id') id: string, @Body() updateProject: CreateProjectDto, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.PROJECT_RECORD_UPDATED]).setSuccessData(await this.projectService.updateProject(id, updateProject, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_UPDATE_PROJECT, err);
        }
    }

    @Delete('delete/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.DELETE)
    @Feature(FEATURE_IDENTIFIER.PROJECT)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Delete/disable a Project', description: 'This is soft delete api which change status of project to false' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_DELETE_PROJECT })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.OK, type: ProjectResponseDto, description: MANAGE_PROJECT_CONSTANT.PROJECT_DELETE_SUCCESS })
    async deleteProject(@Param('id') id: string, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.PROJECT_DELETE_SUCCESS]).setSuccessData(await this.projectService.deleteProject(id, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_DELETE_PROJECT, err);
        }
    }

    @Patch('enable/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.DELETE)
    @Feature(FEATURE_IDENTIFIER.PROJECT)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Enable project' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_ENABLE_PROJECT })
    @ApiResponse({ status: HttpStatus.OK, type: ProjectResponseDto, description: MANAGE_PROJECT_CONSTANT.PROJECT_ENABLED_SUCCESS })
    async enableProject(@Param('id') id: string, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.PROJECT_ENABLED_SUCCESS]).setSuccessData(await this.projectService.enableProject(id, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_ENABLE_PROJECT, err);
        }
    }

    @Post('purpose/:id')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.PROJECT_PURPOSE)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @UseInterceptors(
        FileInterceptor('purposeDoc', {
            storage: diskStorage({ destination: purposeDocDestinationFolder, filename: editFileName }),
            fileFilter: docsFileFilter
        })
    )
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Add project purpose' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_ADD_PROJECT_PROJECT })
    @ApiResponse({ status: HttpStatus.OK, type: ProjectPurposeResponseDto, description: MANAGE_PROJECT_CONSTANT.PROJECT_PROJECT_ADDED_SUCCESS })
    async addPurpose(@UploadedFile() file: Express.Multer.File, @Req() req: Request, @Param('id') id: string, @Body() purpose: AddProjectPurposeDto): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.PROJECT_PROJECT_ADDED_SUCCESS]).setSuccessData(await this.projectService.addProjectPurpose(id, req, file, purpose)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_ADD_PROJECT_PROJECT, err);
        }
    }

    @Get('can-add-project')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.PROJECT, FEATURE_IDENTIFIER.MODEL_VERSION)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Checks we can add project or not' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_CAN_ADD_PROJECT_AND_VERSION })
    @ApiResponse({ status: HttpStatus.OK, type: Boolean, description: MANAGE_PROJECT_CONSTANT.GOT_CAN_ADD_PROJECT_AND_VERSION_SUCCESS })
    async canAddProject(@Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_CAN_ADD_PROJECT_AND_VERSION_SUCCESS]).setSuccessData(await this.projectService.canAddProject(req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_CAN_ADD_PROJECT_AND_VERSION, err);
        }
    }

    @Get('bc-details/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.PROJECT)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Get Project blockchain details' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_GET_PROJECT_BC_DETAILS })
    @ApiResponse({ status: HttpStatus.OK, type: BCProjectResponseDto, description: MANAGE_PROJECT_BC_CONSTANT.PROJECT_BC_DETAILS_RETRIEVED_SUCCESS })
    async getBcProjectDetails(@Param('id') projectId: string, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_BC_CONSTANT.PROJECT_BC_DETAILS_RETRIEVED_SUCCESS]).setSuccessData(await this.projectBcService.getProjectBcDetails(projectId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_GET_PROJECT_BC_DETAILS, err);
        }
    }

    @Get('bc-history/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.PROJECT)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Get project blockchain history' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_PROJECT_BC_HISTORY })
    @ApiResponse({ status: HttpStatus.OK, type: BCProjectResponseDto, isArray: true, description: MANAGE_PROJECT_BC_CONSTANT.PROJECT_BC_HISTORY_FETCHED_SUCCESS })
    async getProjectBcHistory(@Param('id') projectId: string, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_BC_CONSTANT.PROJECT_BC_HISTORY_FETCHED_SUCCESS]).setSuccessData(await this.projectBcService.getProjectBcHistory(projectId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_PROJECT_BC_HISTORY, err);
        }
    }
}

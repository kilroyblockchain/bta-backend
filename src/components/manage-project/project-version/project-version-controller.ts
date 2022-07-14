import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, MANAGE_PROJECT_CONSTANT, ROLE } from 'src/@core/constants';
import { PermissionGuard, RolesGuard } from 'src/components/auth/guards';
import { Feature, Permission, Roles } from 'src/components/auth/decorators';
import { AddVersionDto, BCVersionDataResponseDto, BCVersionHistoryResponseDto, VersionInfoResponseDto, VersionResponseDto } from './dto';
import { ProjectVersionService } from './project-version.service';
import { Response as FLOResponse } from 'src/@core/response';
import { Request } from 'express';
import { VersionBcService } from './project-version-bc.service';
import { COMMON_ERROR } from 'src/@core/constants/api-error-constants';
import { MANAGE_PROJECT_BC_CONSTANT } from 'src/@core/constants/bc-constants/bc-manage-project.constant';

@ApiTags('Project Version')
@UseGuards(RolesGuard)
@Controller('project-version')
export class ProjectVersionController {
    constructor(private readonly versionService: ProjectVersionService, private readonly versionBcService: VersionBcService) {}

    @Post(':id')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.MODEL_VERSION)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Add new version in project' })
    @ApiParam({ name: 'id', required: true, description: 'Project Id' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_ADD_VERSION })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: MANAGE_PROJECT_CONSTANT.PROJECT_VERSION_CONFLICT })
    @ApiResponse({ status: HttpStatus.CREATED, type: VersionResponseDto, description: MANAGE_PROJECT_CONSTANT.NEW_VERSION_ADDED_SUCCESS })
    async addVersion(@Body() newVersion: AddVersionDto, @Req() req: Request, @Param('id') projectId: string): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.NEW_VERSION_ADDED_SUCCESS]).setSuccessData(await this.versionService.addNewVersion(req, projectId, newVersion)).setStatus(HttpStatus.CREATED);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_ADD_VERSION, err);
        }
    }

    @Put('update/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.MODEL_VERSION)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Update project version' })
    @ApiParam({ name: 'id', required: true, description: 'Version Id' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_UPDATE_VERSION })
    @ApiResponse({ status: HttpStatus.OK, type: VersionResponseDto, description: MANAGE_PROJECT_CONSTANT.UPDATE_VERSION_SUCCESS })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: MANAGE_PROJECT_CONSTANT.PROJECT_VERSION_CONFLICT })
    async updateVersion(@Param('id') id: string, @Req() req: Request, @Body() updateVersion: AddVersionDto): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.UPDATE_VERSION_SUCCESS]).setSuccessData(await this.versionService.updateVersion(id, updateVersion, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_UPDATE_VERSION, err);
        }
    }

    @Get('info/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.MODEL_VERSION)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Get details of project version' })
    @ApiParam({ name: 'id', required: true, description: 'Version Id' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_VERSION_INFO })
    @ApiResponse({ status: HttpStatus.OK, type: VersionInfoResponseDto, description: MANAGE_PROJECT_CONSTANT.GET_VERSION_INFO_SUCCESS })
    async getVersionDetails(@Param('id') id: string): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.GET_VERSION_INFO_SUCCESS]).setSuccessData(await this.versionService.getVersionInfo(id)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND, err);
        }
    }

    @Delete('delete/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.DELETE)
    @Feature(FEATURE_IDENTIFIER.MODEL_VERSION)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Delete/disable a version', description: 'This is soft delete api which change status of version to false' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_DELETE_VERSION })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.OK, type: VersionResponseDto, description: MANAGE_PROJECT_CONSTANT.VERSION_DELETE_SUCCESS })
    async deleteProject(@Param('id') id: string): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.VERSION_DELETE_SUCCESS]).setSuccessData(await this.versionService.deleteVersion(id)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_DELETE_VERSION, err);
        }
    }

    @Patch('enable/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.DELETE)
    @Feature(FEATURE_IDENTIFIER.MODEL_VERSION)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Enable project' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_ENABLE_VERSION })
    @ApiResponse({ status: HttpStatus.OK, type: VersionResponseDto, description: MANAGE_PROJECT_CONSTANT.VERSION_ENABLED_SUCCESS })
    async enableProject(@Param('id') id: string): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.VERSION_ENABLED_SUCCESS]).setSuccessData(await this.versionService.enableVersion(id)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_ENABLE_VERSION, err);
        }
    }

    @Get('bc-details/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.MODEL_VERSION)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Get Project Version blockchain details' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_GET_PROJECT_VERSION_BC_DETAILS })
    @ApiResponse({ status: HttpStatus.OK, type: BCVersionDataResponseDto, description: MANAGE_PROJECT_BC_CONSTANT.PROJECT_VERSION_BC_DETAILS_RETRIEVED_SUCCESS })
    async getBcProjectDetails(@Param('id') versionId: string, @Req() req: Request): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_BC_CONSTANT.PROJECT_VERSION_BC_DETAILS_RETRIEVED_SUCCESS]).setSuccessData(await this.versionBcService.getProjectVersionDetails(versionId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_GET_PROJECT_VERSION_BC_DETAILS, err);
        }
    }

    @Get('bc-history/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.MODEL_VERSION)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Get project version blockchain history' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_PROJECT_VERSION_BC_HISTORY })
    @ApiResponse({ status: HttpStatus.OK, type: BCVersionHistoryResponseDto, isArray: true, description: MANAGE_PROJECT_BC_CONSTANT.PROJECT_VERSION_BC_HISTORY_FETCHED_SUCCESS })
    async getProjectBcHistory(@Param('id') versionId: string, @Req() req: Request): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_BC_CONSTANT.PROJECT_VERSION_BC_HISTORY_FETCHED_SUCCESS]).setSuccessData(await this.versionBcService.getProjectVersionBcHistory(versionId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_PROJECT_VERSION_BC_HISTORY, err);
        }
    }

    @Patch('submit/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.MODEL_VERSION)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Submit the the version model', description: 'When model version is submitted then its status is changes Draft to Pending' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_SUBMIT_MODEL_VERSION })
    @ApiResponse({ status: HttpStatus.OK, type: VersionResponseDto, isArray: true, description: MANAGE_PROJECT_CONSTANT.MODEL_VERSION_SUBMITTED_SUCCESS })
    async submitModelVersion(@Param('id') versionId: string, @Req() req: Request): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.MODEL_VERSION_SUBMITTED_SUCCESS]).setSuccessData(await this.versionService.submitModelVersion(req, versionId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_SUBMIT_MODEL_VERSION, err);
        }
    }
}

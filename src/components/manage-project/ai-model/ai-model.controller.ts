import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Param, Req, UseGuards } from '@nestjs/common';
import { AiModelService } from './ai-model.service';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard, RolesGuard } from 'src/components/auth/guards';
import { Feature, Permission, Roles } from 'src/components/auth/decorators';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Response as FLOResponse } from 'src/@core/response';
import { Request } from 'express';
import { COMMON_ERROR, MANAGE_PROJECT_CONSTANT } from 'src/@core/constants/api-error-constants';
import { VersionLogAllExpResponseDto, LogExperimentDetailsResponseDto, LogExperimentInfoResponseDto } from './dto';
import { VersionResponseDto } from '../project-version/dto';

@ApiTags('AI Model')
@UseGuards(RolesGuard)
@Controller('ai-model')
export class AiModelController {
    constructor(private readonly aiModelService: AiModelService) {}

    @Get('all/:id')
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
    @ApiOperation({ summary: 'Get All AI-Model Experiments of the version' })
    @ApiParam({ name: 'id', required: true, description: 'Version Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_RETRIEVE_VERSION_EXPERIMENTS })
    @ApiResponse({ status: HttpStatus.OK, type: VersionLogAllExpResponseDto, isArray: true, description: MANAGE_PROJECT_CONSTANT.ALL_VERSION_EXPERIMENTS_RETRIEVED })
    async getAllVersionExp(@Req() req: Request, @Param('id') versionId: string): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.ALL_VERSION_EXPERIMENTS_RETRIEVED]).setSuccessData(await this.aiModelService.getAllExperiment(req, versionId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_RETRIEVE_VERSION_EXPERIMENTS, err);
        }
    }

    @Get('expDetails/:id')
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
    @ApiOperation({ summary: "Get details of AI-Model log's experiment" })
    @ApiParam({ name: 'id', required: true, description: 'experiment Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_RETRIEVE_LOG_EXPERIMENT_DETAILS })
    @ApiResponse({ status: HttpStatus.OK, type: LogExperimentDetailsResponseDto, isArray: true, description: MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_DETAILS_RETRIEVED })
    async fetchExperimentDetails(@Param('id') id: string): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_DETAILS_RETRIEVED]).setSuccessData(await this.aiModelService.getExperimentDetails(id)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_RETRIEVE_LOG_EXPERIMENT_DETAILS, err);
        }
    }

    @Get('expInfo/:id')
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
    @ApiOperation({ summary: 'Get experiment information' })
    @ApiParam({ name: 'id', required: true, description: 'experiment Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_RETRIEVE_LOG_EXPERIMENT_INFO })
    @ApiResponse({ status: HttpStatus.OK, type: LogExperimentInfoResponseDto, description: MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_INFO_RETRIEVED })
    async getExperimentInfo(@Param('id') id: string): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_INFO_RETRIEVED]).setSuccessData(await this.aiModelService.getExperimentInfo(id)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_RETRIEVE_LOG_EXPERIMENT_INFO, err);
        }
    }

    @Get('log-files-hash/:id')
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
    @ApiOperation({ summary: "Get log file oracle data's bc hash" })
    @ApiParam({ name: 'id', required: true, description: 'version Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_LOG_FILE_ORACLE_BC_HASH })
    @ApiResponse({ status: HttpStatus.OK, type: VersionResponseDto, description: MANAGE_PROJECT_CONSTANT.GOT_LOG_FILE_ORACLE_BC_HASH_SUCCESS })
    async getLogFileBcHash(@Param('id') versionId: string, @Req() req: Request): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_LOG_FILE_ORACLE_BC_HASH_SUCCESS]).setSuccessData(await this.aiModelService.getLogFileHash(versionId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_LOG_FILE_ORACLE_BC_HASH, err);
        }
    }

    @Get('test-data-hash/:id')
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
    @ApiOperation({ summary: "Get test data sets oracle data's bc hash" })
    @ApiParam({ name: 'id', required: true, description: 'version Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_TEST_DATA_SET_ORACLE_BC_HASH })
    @ApiResponse({ status: HttpStatus.OK, type: VersionResponseDto, description: MANAGE_PROJECT_CONSTANT.GOT_TEST_DATA_SET_ORACLE_BC_HASH_SUCCESS })
    async getTestDataBcHash(@Param('id') versionId: string, @Req() req: Request): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_TEST_DATA_SET_ORACLE_BC_HASH_SUCCESS]).setSuccessData(await this.aiModelService.getTestDataBcHash(versionId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_TEST_DATA_SET_ORACLE_BC_HASH, err);
        }
    }

    @Get('train-data-hash/:id')
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
    @ApiOperation({ summary: "Get test data sets oracle data's bc hash" })
    @ApiParam({ name: 'id', required: true, description: 'version Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_AI_MODEL_ORACLE_BC_HASH })
    @ApiResponse({ status: HttpStatus.OK, type: VersionResponseDto, description: MANAGE_PROJECT_CONSTANT.GOT_TRAIN_DATA_SET_ORACLE_BC_HASH_SUCCESS })
    async getTrainDataSetsBcHash(@Param('id') versionId: string, @Req() req: Request): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_TRAIN_DATA_SET_ORACLE_BC_HASH_SUCCESS]).setSuccessData(await this.aiModelService.getTrainDataSetsBcHash(versionId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_TRAIN_DATA_SET_ORACLE_BC_HASH, err);
        }
    }

    @Get('ai-model-hash/:id')
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
    @ApiOperation({ summary: "Get ai model oracle data's bc hash" })
    @ApiParam({ name: 'id', required: true, description: 'version Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_AI_MODEL_ORACLE_BC_HASH })
    @ApiResponse({ status: HttpStatus.OK, type: VersionResponseDto, description: MANAGE_PROJECT_CONSTANT.GOT_AI_MODEL_ORACLE_BC_HASH_SUCCESS })
    async getAiModelBcHash(@Param('id') versionId: string, @Req() req: Request): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_AI_MODEL_ORACLE_BC_HASH_SUCCESS]).setSuccessData(await this.aiModelService.getAiModelBcHash(versionId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_AI_MODEL_ORACLE_BC_HASH, err);
        }
    }
}

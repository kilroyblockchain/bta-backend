import { BadRequestException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Req, UseGuards } from '@nestjs/common';
import { AiModelService } from './ai-model.service';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard, RolesGuard } from 'src/components/auth/guards';
import { Feature, Permission, Roles } from 'src/components/auth/decorators';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Response as BTAResponse } from 'src/@core/response';
import { Request } from 'express';
import { COMMON_ERROR, MANAGE_PROJECT_CONSTANT } from 'src/@core/constants/api-error-constants';
import { VersionLogAllExpResponseDto, LogExperimentDetailsResponseDto, LogExperimentInfoResponseDto, DeleteTempOracleDataHashDto, BcModelExperimentDetailsDto, BcModelExperimentHistoryDto, BcArtifactModelDetailsDto, BcArtifactModelHistoryDto, ArtifactModelResponseDto } from './dto';
import { VersionResponseDto } from '../project-version/dto';
import { MANAGE_PROJECT_BC_CONSTANT } from 'src/@core/constants/bc-constants/bc-manage-project.constant';
import { AIModelBcService } from './ai-model-bc.service';

@ApiTags('AI Model')
@UseGuards(RolesGuard)
@Controller('ai-model')
export class AiModelController {
    constructor(private readonly aiModelService: AiModelService, private readonly aiModelBcService: AIModelBcService) {}

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
    async getAllVersionExp(@Req() req: Request, @Param('id') versionId: string): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.ALL_VERSION_EXPERIMENTS_RETRIEVED]).setSuccessData(await this.aiModelService.getAllExperiment(req, versionId)).setStatus(HttpStatus.OK);
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
    async fetchExperimentDetails(@Param('id') id: string): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_DETAILS_RETRIEVED]).setSuccessData(await this.aiModelService.getExperimentDetails(id)).setStatus(HttpStatus.OK);
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
    async getExperimentInfo(@Param('id') id: string): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_INFO_RETRIEVED]).setSuccessData(await this.aiModelService.getExperimentInfo(id)).setStatus(HttpStatus.OK);
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
    async getLogFileBcHash(@Param('id') versionId: string, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_LOG_FILE_ORACLE_BC_HASH_SUCCESS]).setSuccessData(await this.aiModelService.getLogFileHash(versionId, req)).setStatus(HttpStatus.OK);
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
    async getTestDataBcHash(@Param('id') versionId: string, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_TEST_DATA_SET_ORACLE_BC_HASH_SUCCESS]).setSuccessData(await this.aiModelService.getTestDataBcHash(versionId, req)).setStatus(HttpStatus.OK);
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
    async getTrainDataSetsBcHash(@Param('id') versionId: string, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_TRAIN_DATA_SET_ORACLE_BC_HASH_SUCCESS]).setSuccessData(await this.aiModelService.getTrainDataSetsBcHash(versionId, req)).setStatus(HttpStatus.OK);
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
    async getAiModelBcHash(@Param('id') versionId: string, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_AI_MODEL_ORACLE_BC_HASH_SUCCESS]).setSuccessData(await this.aiModelService.getAiModelBcHash(versionId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_AI_MODEL_ORACLE_BC_HASH, err);
        }
    }

    @Get('all-experiment-details/:id')
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
    @ApiOperation({ summary: 'Get all experiment details oracle log files' })
    @ApiParam({ name: 'id', required: true, description: 'version Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_ALL_EXPERIMENT_DETAILS })
    @ApiResponse({ status: HttpStatus.OK, type: LogExperimentDetailsResponseDto, isArray: true, description: MANAGE_PROJECT_CONSTANT.GOT_ALL_EXPERIMENT_DETAILS_SUCCESS })
    async getAllExperiments(@Param('id') versionId: string): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_ALL_EXPERIMENT_DETAILS_SUCCESS]).setSuccessData(await this.aiModelService.getAllExperimentDetails(versionId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_ALL_EXPERIMENT_DETAILS, err);
        }
    }

    @Get('logs-oracle-bc-hash/:id')
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
    @ApiOperation({ summary: 'Get log files all experiment data  latest oracle bc hash' })
    @ApiParam({ name: 'id', required: true, description: 'version Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_LOG_FILE_ORACLE_BC_HASH })
    @ApiResponse({ status: HttpStatus.OK, schema: { example: { data: 'c0cff8630bc46102a242bba2d31db07ac17af28142a7cb608610badf8ec5cd07' } }, description: MANAGE_PROJECT_CONSTANT.GOT_LOG_FILE_ORACLE_BC_HASH_SUCCESS })
    async getLogFileOracleBcHash(@Param('id') versionId: string): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_LOG_FILE_ORACLE_BC_HASH_SUCCESS]).setSuccessData(await this.aiModelService.getLogFileOracleBcHash(versionId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_LOG_FILE_ORACLE_BC_HASH, err);
        }
    }

    @Get('test-data-oracle-bc-hash/:id')
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
    @ApiOperation({ summary: 'Get test data latest oracle bc hash' })
    @ApiParam({ name: 'id', required: true, description: 'version Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_TEST_DATA_SET_ORACLE_BC_HASH })
    @ApiResponse({ status: HttpStatus.OK, schema: { example: { data: '62efd37ef24e4b26ff79c760' } }, description: MANAGE_PROJECT_CONSTANT.GOT_TEST_DATA_SET_ORACLE_BC_HASH_SUCCESS })
    async getTestDataOracleBcHash(@Param('id') versionId: string): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_ALL_EXPERIMENT_DETAILS_SUCCESS]).setSuccessData(await this.aiModelService.getTestDataOracleBcHash(versionId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_TEST_DATA_SET_ORACLE_BC_HASH, err);
        }
    }

    @Get('train-data-oracle-bc-hash/:id')
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
    @ApiOperation({ summary: 'Get train data latest oracle bc hash' })
    @ApiParam({ name: 'id', required: true, description: 'version Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_TRAIN_DATA_SET_ORACLE_BC_HASH })
    @ApiResponse({ status: HttpStatus.OK, schema: { example: { data: '62efd1a9f24e4b26ff79c566' } }, description: MANAGE_PROJECT_CONSTANT.GOT_TRAIN_DATA_SET_ORACLE_BC_HASH_SUCCESS })
    async getTrainDataOracleBcHash(@Param('id') versionId: string): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_TRAIN_DATA_SET_ORACLE_BC_HASH_SUCCESS]).setSuccessData(await this.aiModelService.getTrainDataOracleBcHash(versionId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_TRAIN_DATA_SET_ORACLE_BC_HASH, err);
        }
    }

    @Get('ai-model-oracle-bc-hash/:id')
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
    @ApiOperation({ summary: 'Get ai model latest oracle bc hash' })
    @ApiParam({ name: 'id', required: true, description: 'version Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_AI_MODEL_ORACLE_BC_HASH })
    @ApiResponse({ status: HttpStatus.OK, schema: { example: { data: '62efd37ef24e4b26ff79c760' } }, description: MANAGE_PROJECT_CONSTANT.GOT_AI_MODEL_ORACLE_BC_HASH_SUCCESS })
    async getAIModelOracleBcHash(@Param('id') versionId: string): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_AI_MODEL_ORACLE_BC_HASH_SUCCESS]).setSuccessData(await this.aiModelService.getAIModelOracleBcHash(versionId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_AI_MODEL_ORACLE_BC_HASH, err);
        }
    }

    @Get('log-experiment-oracle-bc-hash/:id')
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
    @ApiOperation({ summary: 'Get single experiment latest oracle bc hash' })
    @ApiParam({ name: 'id', required: true, description: 'version Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_SINGLE_EXPERIMENT_ORACLE_BC_HASH })
    @ApiResponse({ status: HttpStatus.OK, schema: { example: { data: '1905182e52b6b2da25cbeef11cd38e75349aa072bc2a2ddb934e0eca50d61acb' } }, description: MANAGE_PROJECT_CONSTANT.GOT_SINGLE_EXPERIMENT_ORACLE_BC_HASH_SUCCESS })
    async getExperimentOracleBcHash(@Param('id') experimentId: string): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_ALL_EXPERIMENT_DETAILS_SUCCESS]).setSuccessData(await this.aiModelService.getExperimentOracleBcHash(experimentId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.GOT_SINGLE_EXPERIMENT_ORACLE_BC_HASH_SUCCESS, err);
        }
    }

    @Get('download-experiment-log/:id')
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
    @ApiOperation({ summary: 'Get single experiment latest oracle bc hash' })
    @ApiParam({ name: 'id', required: true, description: 'version Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_DOWNLOAD_LOG_FILE })
    @ApiResponse({
        status: HttpStatus.OK,
        schema: { example: { data: 'https://objectstorage.us-phoenix-1.oraclecloud.com' } },
        description: MANAGE_PROJECT_CONSTANT.LOG_FILE_DOWNLOAD_SUCCESS
    })
    async downloadExperimentLogFile(@Param('id') experimentId: string): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.LOG_FILE_DOWNLOAD_SUCCESS]).setSuccessData(await this.aiModelService.downloadExperimentLogFile(experimentId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_DOWNLOAD_LOG_FILE, err);
        }
    }

    @Get('get-oracle-data-hash/:id')
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
    @ApiOperation({ summary: 'Get Oracle Data Hash' })
    @ApiParam({ name: 'id', required: true, description: 'hash Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.ORACLE_HASH_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_ORACLE_HASH })
    @ApiResponse({ status: HttpStatus.OK, type: DeleteTempOracleDataHashDto, description: MANAGE_PROJECT_CONSTANT.GOT_ORACLE_HASH_SUCCESS })
    async getOracleDataHash(@Param('id') hashId: string): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_ORACLE_HASH_SUCCESS]).setSuccessData(await this.aiModelService.getOracleDataHash(hashId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_ORACLE_HASH, err);
        }
    }

    @Delete('delete-temp-oracle-data/:id')
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
    @ApiOperation({ summary: 'Delete temp Oracle Data Hash' })
    @ApiParam({ name: 'id', required: true, description: 'hash Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.ORACLE_HASH_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_DELETE_ORACLE_HASH })
    @ApiResponse({ status: HttpStatus.OK, type: DeleteTempOracleDataHashDto, description: MANAGE_PROJECT_CONSTANT.DELETED_ORACLE_HASH_SUCCESS })
    async deleteTempOracleDataHash(@Param('id') hashId: string): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.DELETED_ORACLE_HASH_SUCCESS]).setSuccessData(await this.aiModelService.deleteTempOracleDataHash(hashId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_DELETE_ORACLE_HASH, err);
        }
    }

    @Get('experiment-bc-details/:id')
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
    @ApiOperation({ summary: 'Get experiment blockchain details' })
    @ApiParam({ name: 'id', required: true, description: 'Experiment Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_MODEL_EXPERIMENT_BC_DETAILS })
    @ApiResponse({ status: HttpStatus.OK, type: BcModelExperimentDetailsDto, description: MANAGE_PROJECT_BC_CONSTANT.MODEL_EXPERIMENT_BC_DETAILS_RETRIEVED_SUCCESS })
    async getExperimentBcDetails(@Param('id') experimentId: string, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_BC_CONSTANT.MODEL_EXPERIMENT_BC_DETAILS_RETRIEVED_SUCCESS]).setSuccessData(await this.aiModelBcService.getExperimentBcDetails(experimentId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_MODEL_EXPERIMENT_BC_DETAILS, err);
        }
    }

    @Get('experiment-bc-history/:id')
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
    @ApiOperation({ summary: 'Get experiment blockchain history' })
    @ApiParam({ name: 'id', required: true, description: 'Experiment Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_MODEL_EXPERIMENT_BC_HISTORY })
    @ApiResponse({ status: HttpStatus.OK, type: BcModelExperimentHistoryDto, isArray: true, description: MANAGE_PROJECT_BC_CONSTANT.MODEL_EXPERIMENT_BC_HISTORY_RETRIEVED_SUCCESS })
    async getExperimentBcHistory(@Param('id') experimentId: string, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_BC_CONSTANT.MODEL_EXPERIMENT_BC_HISTORY_RETRIEVED_SUCCESS]).setSuccessData(await this.aiModelBcService.getExperimentBcHistory(experimentId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_MODEL_EXPERIMENT_BC_HISTORY, err);
        }
    }

    @Get('artifact-model-bc-details/:id')
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
    @ApiOperation({ summary: 'Get artifact model blockchain details' })
    @ApiParam({ name: 'id', required: true, description: 'artifact model Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.ARTIFACT_MODEL_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_ARTIFACT_MODEL_BC_DETAILS })
    @ApiResponse({ status: HttpStatus.OK, type: BcArtifactModelDetailsDto, description: MANAGE_PROJECT_BC_CONSTANT.ARTIFACT_MODEL_BC_DETAILS_RETRIEVED_SUCCESS })
    async getArtifactModelBcDetails(@Param('id') modelId: string, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_BC_CONSTANT.ARTIFACT_MODEL_BC_DETAILS_RETRIEVED_SUCCESS]).setSuccessData(await this.aiModelBcService.getArtifactModelBcDetails(modelId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_ARTIFACT_MODEL_BC_DETAILS, err);
        }
    }

    @Get('artifact-model-bc-history/:id')
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
    @ApiOperation({ summary: 'Get artifact model blockchain details' })
    @ApiParam({ name: 'id', required: true, description: 'artifact model Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.ARTIFACT_MODEL_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_ARTIFACT_MODEL_BC_HISTORY })
    @ApiResponse({ status: HttpStatus.OK, type: BcArtifactModelHistoryDto, isArray: true, description: MANAGE_PROJECT_BC_CONSTANT.ARTIFACT_MODEL_BC_HISTORY_RETRIEVED_SUCCESS })
    async getArtifactModelBcHistory(@Param('id') modelId: string, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_BC_CONSTANT.ARTIFACT_MODEL_BC_HISTORY_RETRIEVED_SUCCESS]).setSuccessData(await this.aiModelBcService.getArtifactModelBcHistory(modelId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_ARTIFACT_MODEL_BC_HISTORY, err);
        }
    }

    @Get('all-artifacts-model/:id')
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
    @ApiOperation({ summary: 'Get all AI artifact model of the version' })
    @ApiParam({ name: 'id', required: true, description: 'Version Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_RETRIEVE_ARTIFICT_MODEL })
    @ApiResponse({ status: HttpStatus.OK, type: ArtifactModelResponseDto, isArray: true, description: MANAGE_PROJECT_CONSTANT.ALL_ARTIFACT_MODEL_RETRIEVED })
    async getAllArtifactModel(@Param('id') versionId: string, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.ALL_ARTIFACT_MODEL_RETRIEVED]).setSuccessData(await this.aiModelService.getAllArtifactModel(versionId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_RETRIEVE_ARTIFICT_MODEL, err);
        }
    }

    @Get('artifact-model-oracle-hash/:id')
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
    @ApiOperation({ summary: 'Get ai artifact model latest oracle bc hash' })
    @ApiParam({ name: 'id', required: true, description: 'model Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.ARTIFACT_MODEL_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_AI_MODEL_ORACLE_BC_HASH })
    @ApiResponse({ status: HttpStatus.OK, schema: { example: { data: '62efd37ef24e4b26ff79c760' } }, description: MANAGE_PROJECT_CONSTANT.GOT_ARTIFACT_MODEL_ORACLE_HASH_SUCCESS })
    async getArtifactModelOracleBcHash(@Param('id') modelId: string): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_ARTIFACT_MODEL_ORACLE_HASH_SUCCESS]).setSuccessData(await this.aiModelService.getArtifactModelOracleBcHash(modelId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_ARTIFACT_MODEL_ORACLE_HASH, err);
        }
    }

    @Get('artifact-model-details/:id')
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
    @ApiParam({ name: 'id', required: true, description: 'expriment Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_AI_MODEL_ORACLE_BC_HASH })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_ARTIFACT_MODEL_DETAILS })
    @ApiResponse({ status: HttpStatus.OK, type: ArtifactModelResponseDto, description: MANAGE_PROJECT_CONSTANT.ALL_ARTIFACT_MODEL_RETRIEVED })
    async getArtifactModelDetails(@Param('id') expId: string): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.GOT_ARTIFACT_MODEL_DETAILS_SUCCESS]).setSuccessData(await this.aiModelService.getArtifactModelDetails(expId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_GET_ARTIFACT_MODEL_DETAILS, err);
        }
    }
}

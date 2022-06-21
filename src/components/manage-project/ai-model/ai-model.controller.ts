import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Param, Req, UseGuards } from '@nestjs/common';
import { AiModelService } from './ai-model.service';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard, RolesGuard } from 'src/components/auth/guards';
import { Feature, Permission, Roles } from 'src/components/auth/decorators';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Response as FLOResponse } from 'src/@core/response';
import { Request } from 'express';
import { COMMON_ERROR, MANAGE_PROJECT_CONSTANT } from 'src/@core/constants/api-error-constants';
import { AllVersionAiModelExp } from './dto';

@ApiTags('AI Model')
@UseGuards(RolesGuard)
@Controller('ai-model')
export class AiModelController {
    constructor(private readonly aiModelService: AiModelService) {}

    @Get('all/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.MANAGE_PROJECT)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Get All AI-Model Experiments of the version' })
    @ApiParam({ name: 'id', required: true, description: 'Version Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNVERIFIED_REQUEST })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.UNAUTHORIZED_TO_ACCESS })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_RETRIEVE_VERSION_EXPERIMENTS })
    @ApiResponse({ status: HttpStatus.OK, type: AllVersionAiModelExp, isArray: true, description: MANAGE_PROJECT_CONSTANT.ALL_VERSION_EXPERIMENTS_RETRIEVED })
    async getAllVersionExp(@Req() req: Request, @Param('id') versionId: string): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.ALL_VERSION_EXPERIMENTS_RETRIEVED]).setSuccessData(await this.aiModelService.getAllExperiment(req, versionId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_RETRIEVE_VERSION_EXPERIMENTS, err);
        }
    }
}

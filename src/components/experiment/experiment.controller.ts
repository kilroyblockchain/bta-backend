import { Roles, Permission, Feature } from 'src/components/auth/decorators';
import { Controller, UseGuards, HttpCode, HttpStatus, Post, Body, Get, Req, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Response as FLOResponse } from 'src/@core/response';
import { ExperimentService } from './experiment.service';
import { ExperimentAddDto } from './dto/experiment-add.dto';
import { EXPERIMENT_CONSTANT } from 'src/@core/constants/api-error-constants/experiment.constant';
import { Request } from 'express';

@ApiTags('Experiment')
@Controller('experiment')
export class ExperimentController {
    constructor(private readonly experimentService: ExperimentService) {}

    @Post('create')
    @UseGuards(RolesGuard, PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.EXPERIMENT)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'A admins private route to create experiment' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async createExperiment(@Body() experimentAddDto: ExperimentAddDto): Promise<FLOResponse> {
        return new FLOResponse(true, [EXPERIMENT_CONSTANT.EXPERIMENT_ADDED]).setSuccessData(await this.experimentService.createExperiment(experimentAddDto)).setStatus(HttpStatus.OK);
    }

    @Get('all/:projectId/:projectVersion')
    @UseGuards(RolesGuard, PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.EXPERIMENT)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'A admins private route to get all experiment' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async getExperimentListByProjectVersion(@Req() req: Request, @Param('projectId') projectId: string, @Param('projectVersion') projectVersion: string): Promise<FLOResponse> {
        return new FLOResponse(true, [EXPERIMENT_CONSTANT.EXPERIMENT_LIST_FETCHED]).setSuccessData(await this.experimentService.getExperimentListByProject(req, projectId, projectVersion)).setStatus(HttpStatus.OK);
    }

    @Get(':id')
    @UseGuards(RolesGuard, PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.EXPERIMENT)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'A admins private route to get experiment by id' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async getExperimentDetail(@Param('id') id: string): Promise<FLOResponse> {
        return new FLOResponse(true, [EXPERIMENT_CONSTANT.EXPERIMENT_DETAIL_FETCHED]).setSuccessData(await this.experimentService.getExperimentDetail(id)).setStatus(HttpStatus.OK);
    }
}

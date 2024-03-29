import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MonitoringReportService } from './monitoring-report.service';
import { diskStorage } from 'multer';
import { createMonitoringDocDestinationFolder, docsFileFilter, editFileName } from 'src/@core/utils/file-upload.utils';
import { AddReportDto, MonitoringReportResponseDto, MonitoringStatusResponseDto, VersionAllReportsDto } from './dto';
import { Response as BTAResponse } from 'src/@core/response';
import { Request } from 'express';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, MANAGE_PROJECT_CONSTANT, ROLE } from 'src/@core/constants';
import { PermissionGuard, RolesGuard } from 'src/components/auth/guards';
import { Feature, Permission, Roles } from 'src/components/auth/decorators';
import { COMMON_ERROR } from 'src/@core/constants/api-error-constants';

@ApiTags('Version Monitoring')
@UseGuards(RolesGuard)
@Controller('version-reports')
export class MonitoringReportController {
    constructor(private readonly monitoringService: MonitoringReportService) {}

    @Post(':id')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.MODEL_MONITORING)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Add version monitoring reports' })
    @ApiParam({ name: 'id', required: true, description: 'Version Id' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_ADD_MONITORING_REPORT })
    @ApiResponse({ status: HttpStatus.CREATED, type: MonitoringReportResponseDto, description: MANAGE_PROJECT_CONSTANT.NEW_VERSION_ADDED_SUCCESS })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @UseInterceptors(
        FilesInterceptor('docs', 5, {
            storage: diskStorage({
                destination: createMonitoringDocDestinationFolder,
                filename: editFileName
            }),
            fileFilter: docsFileFilter
        })
    )
    async addMonitoringReport(@Req() req: Request, @Body() newReport: AddReportDto, @UploadedFiles() files: Array<Express.Multer.File>, @Param('id') id: string): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.MONITORING_REPORT_ADDED_SUCCESS]).setSuccessData(await this.monitoringService.addMonitoringReport(req, id, files, newReport)).setStatus(HttpStatus.CREATED);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_ADD_MONITORING_REPORT, err);
        }
    }

    @Get('get/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.MODEL_MONITORING)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Get version monitoring reports' })
    @ApiParam({ name: 'id', required: true, description: 'Version Id' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_RETRIEVE_VERSION_REPORTS })
    @ApiResponse({ status: HttpStatus.OK, type: VersionAllReportsDto, isArray: true, description: MANAGE_PROJECT_CONSTANT.ALL_VERSION_REPORTS_RETRIEVED })
    async getVersionReports(@Param('id') id: string, @Req() req: Request): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.ALL_VERSION_REPORTS_RETRIEVED]).setSuccessData(await this.monitoringService.getVersionReports(req, id)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_RETRIEVE_VERSION_REPORTS, err);
        }
    }

    @Get('status')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.MODEL_MONITORING)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Get version monitoring reports status' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_RETRIEVE_MONITORING_STATUES })
    @ApiResponse({ status: HttpStatus.OK, type: MonitoringStatusResponseDto, isArray: true, description: MANAGE_PROJECT_CONSTANT.ALL_MONITORING_STATUS_RETRIEVED })
    async getMonitoringStatus(): Promise<BTAResponse> {
        try {
            return new BTAResponse(true, [MANAGE_PROJECT_CONSTANT.ALL_MONITORING_STATUS_RETRIEVED]).setSuccessData(await this.monitoringService.getMonitoringStatus()).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_RETRIEVE_MONITORING_STATUES, err);
        }
    }
}

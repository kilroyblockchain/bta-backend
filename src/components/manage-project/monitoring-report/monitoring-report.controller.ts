import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MonitoringReportService } from './monitoring-report.service';
import { diskStorage } from 'multer';
import { createMonitoringDocDestinationFolder, docsFileFilter, editFileName } from 'src/@core/utils/file-upload.utils';
import { AddReportDto, MonitoringReportResponseDto } from './dto';
import { Response as FLOResponse } from 'src/@core/response';
import { Request } from 'express';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, MANAGE_PROJECT_CONSTANT, ROLE } from 'src/@core/constants';
import { PermissionGuard, RolesGuard } from 'src/components/auth/guards';
import { AuthGuard } from '@nestjs/passport';
import { Feature, Permission, Roles } from 'src/components/auth/decorators';

@ApiTags('Version Monitoring')
@UseGuards(RolesGuard)
@Controller('version-reports')
export class MonitoringReportController {
    constructor(private readonly monitoringService: MonitoringReportService) {}

    @Post(':id')
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
    async uploadDocument(@Req() req: Request, @Body() newReport: AddReportDto, @UploadedFiles() files, @Param('id') id: string): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.MONITORING_REPORT_ADDED_SUCCESS]).setSuccessData(await this.monitoringService.addMonitoringReport(req, id, files, newReport)).setStatus(HttpStatus.CREATED);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_ADD_MONITORING_REPORT, err);
        }
    }
}

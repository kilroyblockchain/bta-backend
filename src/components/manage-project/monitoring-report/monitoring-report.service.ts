import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { IMonitoringReport } from './interfaces/monitoring-report.interface';
import { MANAGE_PROJECT_CONSTANT } from 'src/@core/constants';
import { ProjectVersionService } from 'src/components/manage-project/project-version/project-version.service';
import { AddReportDto } from './dto';
import { Request } from 'express';

@Injectable()
export class MonitoringReportService {
    constructor(@InjectModel('version-monitoring-report') private readonly monitoringModel: PaginateModel<IMonitoringReport>, private readonly versionService: ProjectVersionService) {}

    async addMonitoringReport(req: Request, versionId: string, files: Array<Express.Multer.File>, newReport: AddReportDto): Promise<IMonitoringReport> {
        const version = await this.versionService.getVersionById(versionId);
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);
        const report = new this.monitoringModel(newReport);

        files.forEach((file) => {
            const documents = {
                docURL: `/version-reports/${file.filename}`,
                docName: file.filename
            };
            report.documents.push(documents);
        });
        report.version = version._id;
        report.createdBy = req['user']._id;
        return await report.save();
    }

    async getVersionReports(req: Request, versionId: string): Promise<PaginateResult<IMonitoringReport>> {
        const version = await this.versionService.getVersionById(versionId);
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

        const { page = 1, limit = 10 } = req.query;
        const options = {
            populate: [{ path: 'createdBy', select: 'firstName lastName' }],
            lean: true,
            limit: Number(limit),
            page: Number(page),
            sort: { createdAt: -1 }
        };
        return await this.monitoringModel.paginate({ versionId }, options);
    }
}

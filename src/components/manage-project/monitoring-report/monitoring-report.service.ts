import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { IMonitoringReport, IMonitoringStatus } from './interfaces/monitoring-report.interface';
import { MANAGE_PROJECT_CONSTANT } from 'src/@core/constants';
import { ProjectVersionService } from 'src/components/manage-project/project-version/project-version.service';
import { AddReportDto } from './dto';
import { Request } from 'express';
import { UserService } from 'src/components/app-user/user/user.service';

@Injectable()
export class MonitoringReportService {
    constructor(
        @InjectModel('version-monitoring-report') private readonly monitoringModel: PaginateModel<IMonitoringReport>,
        @InjectModel('monitoring-status') private readonly monitoringStatusModel: Model<IMonitoringStatus>,
        private readonly versionService: ProjectVersionService,
        private readonly userService: UserService
    ) {}

    async addMonitoringReport(req: Request, versionId: string, files: Array<Express.Multer.File>, newReport: AddReportDto): Promise<IMonitoringReport> {
        const logger = new Logger(MonitoringReportService.name + '-addMonitoringReport');
        try {
            const version = await this.versionService.getVersionById(versionId);
            if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

            const user = await this.userService.findUserProfile(req);
            const staffing = user.company.staffingId.map((m) => m['staffingName']);

            const report = new this.monitoringModel(newReport);

            files.forEach((file) => {
                const documents = {
                    docURL: `version-reports/${file.filename}`,
                    docName: file.originalname
                };
                report.documents.push(documents);
            });
            report.version = version._id;
            report.createdBy = req['user']._id;
            report.staffing = staffing.join();
            return await report.save();
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getVersionReports(req: Request, versionId: string): Promise<PaginateResult<IMonitoringReport>> {
        const logger = new Logger(MonitoringReportService.name + '-getVersionReports');
        try {
            const version = await this.versionService.getVersionById(versionId);
            if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

            const { page = 1, limit = 15 } = req.query;
            const options = {
                populate: [
                    { path: 'createdBy', select: 'firstName lastName' },
                    { path: 'status', select: 'name' }
                ],
                lean: true,
                limit: Number(limit),
                page: Number(page),
                sort: { createdAt: -1 }
            };
            return await this.monitoringModel.paginate({ version: versionId }, options);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getMonitoringStatus(): Promise<Array<IMonitoringStatus>> {
        const logger = new Logger(MonitoringReportService.name + '-getMonitoringStatus');
        try {
            return await this.monitoringStatusModel.find({});
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}

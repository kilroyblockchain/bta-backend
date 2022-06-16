import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectVersionModule } from 'src/components/manage-project/project-version/project-version.module';
import { MonitoringReportController } from './monitoring-report.controller';
import { MonitoringReportService } from './monitoring-report.service';
import { MonitoringReportSchema } from './schemas/monitoring-report.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'version-monitoring-report', schema: MonitoringReportSchema }]), ProjectVersionModule],
    controllers: [MonitoringReportController],
    providers: [MonitoringReportService]
})
export class MonitoringReportModule {}

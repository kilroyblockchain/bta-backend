import { Module } from '@nestjs/common';
import { MonitoringReportModule } from './monitoring-report/monitoring-report.module';
import { ProjectVersionModule } from './project-version/project-version.module';
import { ProjectModule } from './project/project.module';

@Module({
    imports: [ProjectModule, ProjectVersionModule, MonitoringReportModule]
})
export class ManageProjectModule {}

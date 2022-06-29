import { Module } from '@nestjs/common';
import { AiModelModule } from './ai-model/ai-model.module';
import { ModelReviewModule } from './model-reviews/model-review.module';
import { MonitoringReportModule } from './monitoring-report/monitoring-report.module';
import { ProjectVersionModule } from './project-version/project-version.module';
import { ProjectModule } from './project/project.module';

@Module({
    imports: [ProjectModule, ProjectVersionModule, MonitoringReportModule, AiModelModule, ModelReviewModule]
})
export class ManageProjectModule {}

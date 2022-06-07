import { Module } from '@nestjs/common';
import { ProjectVersionModule } from './project-version/project-version.module';
import { ProjectModule } from './project/project.module';

@Module({
    imports: [ProjectModule, ProjectVersionModule]
})
export class ManageProjectModule {}

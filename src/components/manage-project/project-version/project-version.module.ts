import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModule } from '../project/project.module';
import { ProjectVersionController } from './project-version-controller';
import { ProjectVersionService } from './project-version.service';
import { ProjectVersionSchema } from './schemas/project-version.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'project-version', schema: ProjectVersionSchema }]), ProjectModule],
    controllers: [ProjectVersionController],
    providers: [ProjectVersionService],
    exports: [ProjectVersionService]
})
export class ProjectVersionModule {}

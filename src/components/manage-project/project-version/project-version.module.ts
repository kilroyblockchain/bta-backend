import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/components/app-user/user/user.module';
import { BcConnectionModule } from 'src/components/blockchain/bc-connection/bc-connection.module';
import { ProjectModule } from 'src/components/manage-project/project/project.module';
import { AiModelModule } from 'src/components/manage-project/ai-model/ai-model.module';
import { VersionBcService } from './project-version-bc.service';
import { ProjectVersionController } from './project-version-controller';
import { ProjectVersionService } from './project-version.service';
import { ProjectVersionSchema } from './schemas/project-version.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'project-version', schema: ProjectVersionSchema }]), forwardRef(() => ProjectModule), UserModule, BcConnectionModule, forwardRef(() => AiModelModule)],
    controllers: [ProjectVersionController],
    providers: [ProjectVersionService, VersionBcService],
    exports: [ProjectVersionService, VersionBcService]
})
export class ProjectVersionModule {}

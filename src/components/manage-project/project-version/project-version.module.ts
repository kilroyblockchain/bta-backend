import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/components/app-user/user/user.module';
import { BcConnectionModule } from 'src/components/blockchain/bc-connection/bc-connection.module';
import { ProjectModule } from 'src/components/manage-project/project/project.module';
import { VersionBcService } from './project-version-bc.service';
import { ProjectVersionController } from './project-version-controller';
import { ProjectVersionService } from './project-version.service';
import { ProjectVersionSchema } from './schemas/project-version.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'project-version', schema: ProjectVersionSchema }]), ProjectModule, UserModule, BcConnectionModule],
    controllers: [ProjectVersionController],
    providers: [ProjectVersionService, VersionBcService],
    exports: [ProjectVersionService]
})
export class ProjectVersionModule {}

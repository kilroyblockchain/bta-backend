import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/components/app-user/user/schemas/user.schema';
import { UserModule } from 'src/components/app-user/user/user.module';
import { BcConnectionModule } from 'src/components/blockchain/bc-connection/bc-connection.module';
import { ProjectVersionModule } from 'src/components/manage-project/project-version/project-version.module';
import { ProjectBcService } from './project-bc.service';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectSchema } from './schemas/project.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Project', schema: ProjectSchema },
            { name: 'User', schema: UserSchema }
        ]),
        UserModule,
        BcConnectionModule,
        forwardRef(() => ProjectVersionModule)
    ],
    controllers: [ProjectController],
    providers: [ProjectService, ProjectBcService],
    exports: [ProjectService, ProjectBcService]
})
export class ProjectModule {}

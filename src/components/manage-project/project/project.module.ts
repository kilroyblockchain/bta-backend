import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/components/app-user/user/schemas/user.schema';
import { UserModule } from 'src/components/app-user/user/user.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectSchema } from './schemas/project.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Project', schema: ProjectSchema },
            { name: 'User', schema: UserSchema }
        ]),
        UserModule
    ],
    controllers: [ProjectController],
    providers: [ProjectService],
    exports: [ProjectService]
})
export class ProjectModule {}

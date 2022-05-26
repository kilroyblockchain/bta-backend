import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../flo-user/user/schemas/user.schema';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectSchema } from './schemas/project.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }])],
    controllers: [ProjectController],
    providers: [ProjectService]
})
export class ProjectModule {}

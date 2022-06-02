import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/components/flo-user/user/schemas/user.schema';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectSchema } from './schemas/project.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Project', schema: ProjectSchema },
            { name: 'User', schema: UserSchema }
        ])
    ],
    controllers: [ProjectController],
    providers: [ProjectService]
})
export class ProjectModule {}

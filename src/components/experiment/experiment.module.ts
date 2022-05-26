import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../flo-user/user/schemas/user.schema';
import { ProjectSchema } from '../project/schemas/project.schema';
import { ExperimentController } from './experiment.controller';
import { ExperimentService } from './experiment.service';
import { ExperimentSchema } from './schemas/experiment.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Experiment', schema: ExperimentSchema }]), MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }])],
    controllers: [ExperimentController],
    providers: [ExperimentService]
})
export class ExperimentModule {}

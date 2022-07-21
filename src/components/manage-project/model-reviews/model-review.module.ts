import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/components/app-user/user/user.module';
import { ProjectVersionModule } from '../project-version/project-version.module';
import { ModelReviewBcService } from './bc-model-review.service';
import { ModelReviewController } from './model-review.controller';
import { ModelReviewService } from './model-review.service';
import { ModelReviewSchema } from './schemas/model-review.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'model-review', schema: ModelReviewSchema }]), ProjectVersionModule, UserModule],
    controllers: [ModelReviewController],
    providers: [ModelReviewService, ModelReviewBcService]
})
export class ModelReviewModule {}

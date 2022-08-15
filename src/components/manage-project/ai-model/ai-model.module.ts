import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectVersionModule } from 'src/components/manage-project/project-version/project-version.module';
import { AiModelController } from './ai-model.controller';
import { AiModelService } from './ai-model.service';
import { AiArtifactsModel } from './schemas/ai-artifacts-model.schema';
import { AiModelSchema } from './schemas/ai-mode.schema';
import { AiModelTempHashSchema } from './schemas/ai-model-temp-hash..schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'ai-model', schema: AiModelSchema },
            { name: 'ai-model-temp-hash', schema: AiModelTempHashSchema },
            { name: 'ai-artifacts-model', schema: AiArtifactsModel }
        ]),
        HttpModule,
        forwardRef(() => ProjectVersionModule)
    ],
    controllers: [AiModelController],
    providers: [AiModelService],
    exports: [AiModelService]
})
export class AiModelModule {}

import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectVersionModule } from 'src/components/manage-project/project-version/project-version.module';
import { AiModelController } from './ai-model.controller';
import { AiModelService } from './ai-model.service';
import { AiModelSchema } from './schemas/ai-mode.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'ai-model', schema: AiModelSchema }]), HttpModule, forwardRef(() => ProjectVersionModule)],
    controllers: [AiModelController],
    providers: [AiModelService],
    exports: [AiModelService]
})
export class AiModelModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExperienceService } from './experience.service';
import { ExperienceController } from './experience.controller';
import { experienceSchema } from './schema/experience.schema';
import { UserModule } from '../../user/user.module';
import { ExperienceBcService } from './experience-bc.service';
import { CaModule } from 'src/components/certificate-authority/ca-client.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'experience', schema: experienceSchema }]), UserModule, CaModule],
    providers: [ExperienceService, ExperienceBcService],
    controllers: [ExperienceController]
})
export class ExperienceModule {}

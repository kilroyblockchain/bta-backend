import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaModule } from 'src/components/certificate-authority/ca-client.module';
import { UserModule } from '../../user/user.module';
import { EducationBcService } from './education-bc.service';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';
import { educationSchema } from './schema/education.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'education', schema: educationSchema }]), UserModule, CaModule],
    controllers: [EducationController],
    providers: [EducationService, EducationBcService]
})
export class EducationModule {}

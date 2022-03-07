import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaModule } from 'src/components/certificate-authority/ca-client.module';
import { skillSchema } from './schema/skill.schema';
import { SkillBcService } from './skill-bc.service';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'skill', schema: skillSchema }]), CaModule],
    providers: [SkillService, SkillBcService],
    controllers: [SkillController]
})
export class SkillModule {}

import { Module } from '@nestjs/common';
import { EducationModule } from './education/education.module';
import { ExperienceModule } from './experience/experience.module';
import { SkillModule } from './skill/skill.module';
import { LanguageModule } from './language/language.module';

@Module({
    imports: [EducationModule, ExperienceModule, SkillModule, LanguageModule]
})
export class UserExtraInfoModule {}

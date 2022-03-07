import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { languageSchema } from './schema/language.schema';
import { LanguageBcService } from './language-bc.service';
import { CaModule } from 'src/components/certificate-authority/ca-client.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'language', schema: languageSchema }]), CaModule],
    providers: [LanguageService, LanguageBcService],
    controllers: [LanguageController]
})
export class LanguageModule {}

import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { MailModule } from './mail/mail.module';

@Module({
    imports: [MailModule, FilesModule]
})
export class UtilsModule {}

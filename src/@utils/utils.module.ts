import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { FilesModule } from './files/files.module';
import { MailModule } from './mail/mail.module';

@Module({
    imports: [MailModule, FilesModule, EventsModule]
})
export class UtilsModule {}

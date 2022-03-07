import { Module } from '@nestjs/common';
import { CSVModule } from './csv/csv.module';
import { FilesModule } from './files/files.module';
import { MailModule } from './mail/mail.module';
import { TaskModule } from './task/task.module';

@Module({
    imports: [CSVModule, MailModule, FilesModule, TaskModule]
})
export class UtilsModule {}

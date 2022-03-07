import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/components/utils/mail/mail.module';
import { CompanyTransferModule } from '../company-transfer/company-transfer.module';
import { UserModule } from '../user/user.module';
import { ReportIssueService } from './report-issue.service';
import { ReportIssueController } from './report-issue.controller';
import { ReportIssueSchema } from './schema/report-issue.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'report', schema: ReportIssueSchema }]), UserModule, CompanyTransferModule, MailModule],
    controllers: [ReportIssueController],
    providers: [ReportIssueService],
    exports: [ReportIssueService]
})
export class ReportIssueModule {}

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/components/utils/mail/mail.module';
import { UserModule } from '../user/user.module';
import { CompanyTransferController } from './company-transfer.controller';
import { CompanyTransferService } from './company-transfer.service';
import { CompanyTransferSchema } from './schema/company-transfer.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'CompanyTransfer', schema: CompanyTransferSchema }]), forwardRef(() => UserModule), MailModule],
    controllers: [CompanyTransferController],
    providers: [CompanyTransferService],
    exports: [CompanyTransferService]
})
export class CompanyTransferModule {}

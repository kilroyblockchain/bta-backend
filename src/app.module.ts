import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { FLOUserModule } from './components/flo-user/flo-user.module';
import { UtilsModule } from './components/utils/utils.module';
import { SuperAdminModule } from './components/super-admin/super-admin.module';
import { ReportIssueModule } from './components/flo-user/report-issue/report-issue.module';
import { CompanyTransferModule } from './components/flo-user/company-transfer/company-transfer.module';
import { BlockchainModule } from './components/blockchain/blockchain.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URI, {
            user: process.env.MONGO_USERNAME,
            pass: process.env.MONGO_PASSWORD,
            dbName: process.env.DATABASE_NAME
        }),
        MulterModule.register({
            dest: './uploads'
        }),
        ScheduleModule.forRoot(),
        FLOUserModule,
        UtilsModule,
        SuperAdminModule,
        ReportIssueModule,
        CompanyTransferModule,
        BlockchainModule
        // SharedModule
    ]
})
export class AppModule {}

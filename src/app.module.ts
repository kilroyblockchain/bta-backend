import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import 'dotenv/config';
import { FLOUserModule } from './components/flo-user/flo-user.module';
import { UtilsModule } from './components/utils/utils.module';
import { BlockchainModule } from './components/blockchain/blockchain.module';
import { OracleModule } from './components/oracle/oracle.module';
import { WinstonModule } from 'nest-winston';
import { transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { consoleTransportOptions, dailyRotateFileTransportOptions } from './@core/config/logger.config';
import { ManageProjectModule } from './components/manage-project/manage-project.module';

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
        WinstonModule.forRoot({
            transports: [new transports.Console(consoleTransportOptions), ...(process.env.NO_APP_LOG_T_FILE ? [] : [new DailyRotateFile(dailyRotateFileTransportOptions)])]
        }),
        ScheduleModule.forRoot(),
        FLOUserModule,
        UtilsModule,
        BlockchainModule,
        OracleModule,
        ManageProjectModule
    ]
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WinstonModule } from 'nest-winston';
import { transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import 'dotenv/config';
import { FLOUserModule } from './components/flo-user/flo-user.module';
import { BlockchainModule } from './components/blockchain/blockchain.module';
import { consoleTransportOptions, dailyRotateFileTransportOptions } from './@core/config/logger.config';
import { UtilsModule } from './@utils/utils.module';

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
        EventEmitterModule.forRoot(),
        ScheduleModule.forRoot(),
        FLOUserModule,
        UtilsModule,
        BlockchainModule
    ]
})
export class AppModule {}

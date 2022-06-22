import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import 'dotenv/config';
import { AppUserModule } from './components/app-user/app-user.module';
import { BlockchainModule } from './components/blockchain/blockchain.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WinstonModule } from 'nest-winston';
import { transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import 'dotenv/config';
import { consoleTransportOptions, dailyRotateFileTransportOptions } from './@core/config/logger.config';
import { UtilsModule } from './@utils/utils.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter, LoggingInterceptor } from './@core/interceptors';

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
            level: process.env.ENVIRONMENT === 'local' ? 'debug' : 'info',
            transports: [new transports.Console(consoleTransportOptions), ...(process.env.NO_APP_LOG_T_FILE ? [] : [new DailyRotateFile(dailyRotateFileTransportOptions)])]
        }),
        EventEmitterModule.forRoot(),
        ScheduleModule.forRoot(),
        AppUserModule,
        UtilsModule,
        BlockchainModule
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor
        }
    ]
})
export class AppModule {}

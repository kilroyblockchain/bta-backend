import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { FLOUserModule } from './components/flo-user/flo-user.module';
import { UtilsModule } from './components/utils/utils.module';
import { BlockchainModule } from './components/blockchain/blockchain.module';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { myFormat } from './@core/utils/logger.utils';

const { combine } = format;

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
            transports: [
                new transports.Console({
                    format: combine(format.timestamp(), format.ms(), nestWinstonModuleUtilities.format.nestLike('MyApp', { prettyPrint: true }))
                }),
                new DailyRotateFile({
                    filename: 'logs/application-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: combine(format.timestamp(), format.ms(), myFormat)
                })
            ]
        }),
        ScheduleModule.forRoot(),
        FLOUserModule,
        UtilsModule,
        BlockchainModule
    ]
})
export class AppModule {}

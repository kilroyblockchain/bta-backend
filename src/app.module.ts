import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { FLOUserModule } from './components/flo-user/flo-user.module';
import { UtilsModule } from './components/utils/utils.module';
import { BlockchainModule } from './components/blockchain/blockchain.module';
import { OracleModule } from './components/oracle/oracle.module';

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
        BlockchainModule,
        OracleModule
    ]
})
export class AppModule {}

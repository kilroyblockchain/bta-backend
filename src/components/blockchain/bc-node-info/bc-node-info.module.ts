import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/components/app-user/user/schemas/user.schema';
import { BcConnectionModule } from '../bc-connection/bc-connection.module';
import { BcNodeInfoController } from './bc-node-info.controller';
import { BcNodeInfoService } from './bc-node-info.service';
import { BcNodeInfoSchema } from './schemas/bc-node-info.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'BcNodeInfo', schema: BcNodeInfoSchema },
            { name: 'User', schema: UserSchema }
        ]),
        BcConnectionModule
    ],
    controllers: [BcNodeInfoController],
    providers: [BcNodeInfoService]
})
export class BcNodeInfoModule {}

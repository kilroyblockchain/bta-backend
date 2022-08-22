import { forwardRef, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/components/app-user/user/schemas/user.schema';
import { UserModule } from 'src/components/app-user/user/user.module';
import { BcConnectionModule } from '../bc-connection/bc-connection.module';
import { BcNodeInfoController } from './bc-node-info.controller';
import { BcNodeInfoService } from './bc-node-info.service';
import { BcNodeInfoSchema } from './schemas/bc-node-info.schema';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'BcNodeInfo', schema: BcNodeInfoSchema },
            { name: 'User', schema: UserSchema }
        ]),
        BcConnectionModule,
        forwardRef(() => UserModule)
    ],
    controllers: [BcNodeInfoController],
    providers: [BcNodeInfoService],
    exports: [BcNodeInfoService]
})
export class BcNodeInfoModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRejectInformationSchema } from './schemas/user-reject-info.schema';
import { UserRejectInfoController } from './user-reject-info.controller';
import { UserRejectInfoService } from './user-reject-info.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'UserRejectInformation', schema: UserRejectInformationSchema }])],
    controllers: [UserRejectInfoController],
    providers: [UserRejectInfoService],
    exports: [UserRejectInfoService]
})
export class UserRejectInfoModule {}

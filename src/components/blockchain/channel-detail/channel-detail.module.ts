import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelDetailController } from './channel-detail.controller';
import { ChannelDetailService } from './channel-detail.service';
import { ChannelDetailSchema } from './schema/channel-detail.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'channelDetail', schema: ChannelDetailSchema }])],
    controllers: [ChannelDetailController],
    providers: [ChannelDetailService],
    exports: [ChannelDetailService]
})
export class ChannelDetailModule {}

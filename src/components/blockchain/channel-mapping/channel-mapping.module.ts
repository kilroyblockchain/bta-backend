import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelDetailModule } from '../channel-detail/channel-detail.module';
import { ChannelMappingController } from './channel-mapping.controller';
import { ChannelMappingService } from './channel-mapping.service';
import { ChannelMappingSchema } from './schema/channel-detail.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'channelMapping', schema: ChannelMappingSchema }]), ChannelDetailModule],
    controllers: [ChannelMappingController],
    providers: [ChannelMappingService],
    exports: [ChannelMappingService]
})
export class ChannelMappingModule {}

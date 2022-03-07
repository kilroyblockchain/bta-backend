import { Module } from '@nestjs/common';
import { ChannelDetailModule } from './channel-detail/channel-detail.module';
import { ChannelMappingModule } from './channel-mapping/channel-mapping.module';

@Module({
    imports: [ChannelDetailModule, ChannelMappingModule]
})
export class BlockchainModule {}

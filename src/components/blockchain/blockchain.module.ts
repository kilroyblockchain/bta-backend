import { Module } from '@nestjs/common';
import { BcNodeInfoModule } from './bc-node-info/bc-node-info.module';
import { ChannelDetailModule } from './channel-detail/channel-detail.module';
import { ChannelMappingModule } from './channel-mapping/channel-mapping.module';

@Module({
    imports: [ChannelDetailModule, ChannelMappingModule, BcNodeInfoModule]
})
export class BlockchainModule {}

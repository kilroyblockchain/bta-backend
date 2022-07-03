import { Module } from '@nestjs/common';
import { BcNodeInfoModule } from './bc-node-info/bc-node-info.module';
import { ChannelDetailModule } from './channel-detail/channel-detail.module';

@Module({
    imports: [ChannelDetailModule, BcNodeInfoModule]
})
export class BlockchainModule {}

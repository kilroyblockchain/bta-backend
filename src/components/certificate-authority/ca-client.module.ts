import { Module } from '@nestjs/common';
import { BcConnectionModule } from '../blockchain/bc-connection/bc-connection.module';
import { ChannelMappingModule } from '../blockchain/channel-mapping/channel-mapping.module';
import { CaService } from './ca-client.service';

@Module({
    imports: [ChannelMappingModule, BcConnectionModule],
    controllers: [],
    providers: [CaService],
    exports: [CaService]
})
export class CaModule {}

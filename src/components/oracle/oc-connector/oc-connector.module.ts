import { Module } from '@nestjs/common';
import { OCConnectorService } from './oc-connector.service';

@Module({
    imports: [],
    controllers: [],
    providers: [OCConnectorService],
    exports: [OCConnectorService]
})
export class OCConnectorModule {}

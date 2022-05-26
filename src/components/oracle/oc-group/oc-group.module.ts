import { Module } from '@nestjs/common';
import { OCConnectorService } from '../oc-connector/oc-connector.service';
import { OCGroupController } from './oc-group.controller';
import { OCGroupService } from './oc-group.service';

@Module({
    imports: [],
    controllers: [OCGroupController],
    providers: [OCGroupService, OCConnectorService]
})
export class OCGroupModule {}

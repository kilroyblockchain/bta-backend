import { Module } from '@nestjs/common';
import { OCConnectorService } from '../oc-connector/oc-connector.service';
import { OCUserController } from './oc-user.controller';
import { OCUserService } from './oc-user.service';

@Module({
    imports: [],
    controllers: [OCUserController],
    providers: [OCUserService, OCConnectorService]
})
export class OCUserModule {}

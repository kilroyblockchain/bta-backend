import { Module } from '@nestjs/common';
import { OCConnectorService } from '../oc-connector/oc-connector.service';
import { OCGroupModule } from '../oc-group/oc-group.module';
import { OCUserController } from './oc-user.controller';
import { OCUserService } from './oc-user.service';

@Module({
    imports: [OCGroupModule],
    controllers: [OCUserController],
    providers: [OCUserService, OCConnectorService],
    exports: [OCUserService]
})
export class OCUserModule {}

import { Module } from '@nestjs/common';
import { UserModule } from 'src/components/app-user/user/user.module';
import { OCConnectorService } from '../oc-connector/oc-connector.service';
import { OCGroupModule } from '../oc-group/oc-group.module';
import { OCUserController } from './oc-user.controller';
import { OCUserService } from './oc-user.service';

@Module({
    imports: [OCGroupModule, UserModule],
    controllers: [OCUserController],
    providers: [OCUserService, OCConnectorService],
    exports: [OCUserService]
})
export class OCUserModule {}

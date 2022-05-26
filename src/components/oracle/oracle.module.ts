import { Module } from '@nestjs/common';
import { OCGroupModule } from './oc-group/oc-group.module';
import { OCUserModule } from './oc-user/oc-user.module';

@Module({
    imports: [OCGroupModule, OCUserModule]
})
export class OracleModule {}

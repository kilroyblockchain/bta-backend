import { Global, Module } from '@nestjs/common';
import { BcConnectionService } from './bc-connection.service';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [BcConnectionService],
    exports: [BcConnectionService]
})
export class BcConnectionModule {}

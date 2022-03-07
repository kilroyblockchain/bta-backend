import { Module } from '@nestjs/common';
import { BcConnectionService } from './bc-connection.service';

@Module({
    imports: [],
    controllers: [],
    providers: [BcConnectionService],
    exports: [BcConnectionService]
})
export class BcConnectionModule {}

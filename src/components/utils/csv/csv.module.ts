import { Module } from '@nestjs/common';
import { CSVService } from './csv.service';

@Module({
    imports: [],
    providers: [CSVService],
    exports: [CSVService]
})
export class CSVModule {}

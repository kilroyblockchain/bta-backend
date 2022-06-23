import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountrySchema } from './schemas/country.schema';
import { StateSchema } from './schemas/state.schema';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Countries', schema: CountrySchema },
            { name: 'States', schema: StateSchema }
        ])
    ],
    controllers: [CountryController],
    providers: [CountryService],
    exports: [CountryService]
})
export class CountryModule {}

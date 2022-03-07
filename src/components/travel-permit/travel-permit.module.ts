import { TravelPermitController } from './travel-permit.controller';
import { TravelPermitService } from './travel-permit.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/components/auth/auth.module';
import { Module } from '@nestjs/common';
import { TravelPermitSchema } from './schemas/travel-permit.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'TravelPermit', schema: TravelPermitSchema }]), AuthModule],
    controllers: [TravelPermitController],
    providers: [TravelPermitService]
})
export class TravelPermitModule {}

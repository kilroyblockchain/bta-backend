import { CountryModule } from 'src/components/app-user/country/country.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionSchema } from './schemas/subscription.schema';
import { SubscriptionTypeController } from './subscription-type.controller';
import { SubscriptionTypeService } from './subscription-type.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'subscription', schema: SubscriptionSchema }]), CountryModule],
    controllers: [SubscriptionTypeController],
    providers: [SubscriptionTypeService],
    exports: [SubscriptionTypeService]
})
export class SubscriptionTypeModule {}

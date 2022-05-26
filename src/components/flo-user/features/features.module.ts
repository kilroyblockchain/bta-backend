import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionSchema } from '../subscription-type/schemas/subscription.schema';
import { FeatureController } from './features.controller';
import { FeatureService } from './features.service';
import { FeatureSchema } from './schemas/features.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'feature', schema: FeatureSchema },
            { name: 'subscription', schema: SubscriptionSchema }
        ])
    ],
    controllers: [FeatureController],
    providers: [FeatureService],
    exports: [FeatureService]
})
export class FeatureModule {}

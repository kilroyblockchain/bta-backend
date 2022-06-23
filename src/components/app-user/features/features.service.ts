import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { FEATURES_CONSTANT } from 'src/@core/constants/api-error-constants';
import { ISubscription } from '../subscription-type/interfaces/subscription.interface';
import { IFeature } from './interfaces/features.interface';

@Injectable()
export class FeatureService {
    constructor(
        @InjectModel('feature')
        private readonly FeatureModel: Model<IFeature>,
        @InjectModel('subscription')
        private readonly SubscriptionModel: Model<ISubscription>
    ) {}

    async getAllFeatures(): Promise<Array<IFeature>> {
        const logger = new Logger(FeatureService.name + '-getAllFeatures');
        try {
            return await this.FeatureModel.find().populate('subscriptionId').exec();
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getAllFeaturesOfSubscriptionType(req: Request, subscription: string): Promise<Array<IFeature>> {
        const logger = new Logger(FeatureService.name + '-getAllFeaturesOfSubscriptionType');
        try {
            const user = req['user'];
            const subscriptionType = subscription ? subscription : user.company.find((defCompany) => defCompany.default).subscriptionType;
            if (!subscriptionType) {
                throw new NotFoundException(FEATURES_CONSTANT.SUBSCRIPTION_TYPE_NOT_FOUND);
            }
            const subscriptions = await this.SubscriptionModel.find({
                subscriptionTypeIdentifier: subscriptionType
            }).select('_id');
            return await this.FeatureModel.find({
                subscriptionId: {
                    $all: subscriptions.map((subscription) => subscription._id)
                }
            });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}

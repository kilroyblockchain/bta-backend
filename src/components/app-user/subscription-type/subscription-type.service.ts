import { CountryService } from 'src/components/app-user/country/country.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISubscription, ISubscriptionResponse } from './interfaces/subscription.interface';
import { Request } from 'express';

@Injectable()
export class SubscriptionTypeService {
    constructor(
        @InjectModel('subscription')
        private readonly SubscriptionModel: Model<ISubscription>,
        private readonly countryService: CountryService
    ) {}

    async getAllSubscription(req: Request): Promise<ISubscriptionResponse | Array<ISubscription>> {
        const logger = new Logger(SubscriptionTypeService.name + '-getAllSubscription');
        try {
            const { fetchCountry } = req.query;
            const subscriptionList = await this.SubscriptionModel.find({
                position: { $ne: 0 }
            })
                .sort({ position: 1 })
                .exec();
            if (fetchCountry && fetchCountry === 'true') {
                const countryList = await this.countryService.findAllCountries();
                return { subscriptionList, countryList };
            }
            return subscriptionList;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getFullSubscription(role: string): Promise<string> {
        const logger = new Logger(SubscriptionTypeService.name + '-getFullSubscription');
        try {
            return (await this.SubscriptionModel.findOne({ subscriptionTypeIdentifier: role }))?.subscriptionType;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}

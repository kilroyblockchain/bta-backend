import { CountryService } from 'src/components/flo-user/country/country.service';
import { Injectable } from '@nestjs/common';
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
    }

    async getFullSubscription(role: string): Promise<string> {
        return (await this.SubscriptionModel.findOne({ subscriptionTypeIdentifier: role }))?.subscriptionType;
    }
}

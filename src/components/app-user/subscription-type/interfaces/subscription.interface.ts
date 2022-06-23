import { ICountry } from 'src/components/app-user/country/interfaces/country.interface';
import { Document } from 'mongoose';

export interface ISubscription extends Document {
    subscriptionTypeIdentifier: string;
    subscriptionType: string;
    position: number;
}

export interface ISubscriptionResponse {
    subscriptionList: Array<ISubscription>;
    countryList: Array<ICountry>;
}

import { Document } from 'mongoose';

export interface ICountry extends Document {
    _id: string;
    countryCode: string;
    name: string;
    states?: Array<number>;
}

import { Document } from 'mongoose';

export interface ICountry extends Document {
    _id: number;
    states: Array<number>;
    countryCode: string;
    name: string;
}

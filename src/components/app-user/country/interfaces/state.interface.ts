import { Document } from 'mongoose';

export interface IState extends Document {
    _id: string;
    name: string;
    abbreviation: string;
    countryObjectId: string;
}

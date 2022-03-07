import { Document } from 'mongoose';

export interface IState extends Document {
    name: string;
    countryId: string;
    abbreviation?: string;
    countryObjectId: string;
}

import { Document } from 'mongoose';

export interface ILanguage extends Document {
    _id: string;
    createdBy: string;
    title: string;
    status: boolean;
}

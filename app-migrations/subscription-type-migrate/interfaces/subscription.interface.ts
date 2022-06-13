import { Document, Types } from 'mongoose';

export interface ISubscription extends Document {
    _id: Types.ObjectId;
    subscriptionTypeIdentifier: string;
    subscriptionType: string;
    position: number;
}

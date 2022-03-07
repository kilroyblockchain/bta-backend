import { Document } from 'mongoose';

export interface ISubscription extends Document {
    subscriptionTypeIdentifier: string;
    subscriptionType: string;
    position: number;
}

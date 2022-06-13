import { Document } from 'mongoose';

export interface IVerification extends Document {
    _id: string;
    email: string;
    userName: string;
    userAcceptToken: string;
    userAccept: boolean;
    timeStamp: Date;
    requestedBy: string;
    subscriptionType: string;
    roles: string;
}

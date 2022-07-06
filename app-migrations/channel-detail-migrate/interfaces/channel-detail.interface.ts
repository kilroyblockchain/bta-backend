import { Document } from 'mongoose';

export interface IChannelDetail extends Document {
    _id: string;
    channelName: string;
    connectionProfileName: string;
    status: boolean;
    isDefault: boolean;
}

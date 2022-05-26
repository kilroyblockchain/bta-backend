import { Document } from 'mongoose';

export interface IChannelMapping extends Document {
    _id: string;
    channelId: string;
    organizationId: string;
    staffingId: string;
    walletId: string;
    userId: string;
}

import { Document } from 'mongoose';

export interface IParticipant extends Document {
    _id: string;
    type: string;
    organizationName: string;
    bcNodeUrl: string;
    instanceName: string;
    oracleBucketUrl: string;
    status: boolean;
    channelDetail: string[];
}

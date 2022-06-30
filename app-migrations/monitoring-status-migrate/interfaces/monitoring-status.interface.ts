import { Document, Types } from 'mongoose';

export interface IMonitoringStatus extends Document {
    _id: Types.ObjectId;
    name: string;
}

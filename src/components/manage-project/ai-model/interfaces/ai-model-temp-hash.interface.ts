import { Document } from 'mongoose';

export interface IAIModelTempHash extends Document {
    _id: string;
    hash: string;
    updatedAt: Date;
    createdAt: Date;
}

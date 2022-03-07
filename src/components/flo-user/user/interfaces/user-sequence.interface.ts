import { Document } from 'mongoose';

export interface IUserSequence extends Document {
    organizationId: string;
    organizationCode: string;
    currentSeq: number;
    incrementBy: number;
}

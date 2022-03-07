import { Document } from 'mongoose';

export interface ISequence extends Document {
    organizationId: string;
    organizationCode: string;
    currentSeq: number;
    incrementBy: number;
    module: string;
}

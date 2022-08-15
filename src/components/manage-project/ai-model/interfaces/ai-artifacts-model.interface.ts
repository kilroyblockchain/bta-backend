import { Document } from 'mongoose';

export interface IAiArtifactsModel extends Document {
    modelNo: string;
    modelBcHash: string;
    updatedAt: Date;
    createdAt: Date;
    version: string;
    project: string;
}

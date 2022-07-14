import { Document } from 'mongoose';
import { VersionStatus } from '../enum/version-status.enum';

export interface IProjectVersion extends Document {
    _id: string;
    versionName: string;
    logFilePath: string;
    logFileVersion: string;
    logFileBCHash: string;
    versionModel: string;
    noteBookVersion: string;
    trainDataSets: string;
    trainDatasetBCHash: string;
    testDataSets: string;
    testDatasetBCHash: string;
    aiModel: string;
    aiModelBcHash: string;
    codeVersion: string;
    codeRepo: string;
    comment: string;
    status: boolean;
    versionStatus: VersionStatus | string;
    updatedAt: Date;
    createdAt: Date;
    submittedDate: Date;
    reviewedDate: Date;
    productionDate: Date;
    createdBy: string;
    project: string;
}

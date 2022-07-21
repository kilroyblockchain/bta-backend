import { Document } from 'mongoose';
import { OracleBucketDataStatus, VersionStatus } from '../enum/version-status.enum';

export interface IProjectVersion extends Document {
    _id: string;
    versionName: string;
    logFilePath: string;
    logFileBCHash: string;
    logFileStatus: IOracleBucketDataStatus;
    noteBookVersion: string;
    trainDataSets: string;
    trainDatasetBCHash: string;
    trainDatasetStatus: IOracleBucketDataStatus;
    testDataSets: string;
    testDatasetBCHash: string;
    testDatasetStatus: IOracleBucketDataStatus;
    aiModel: string;
    aiModelBcHash: string;
    aiModelStatus: IOracleBucketDataStatus;
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

export interface IOracleBucketDataStatus {
    message?: string;
    code: OracleBucketDataStatus;
}

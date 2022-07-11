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
    artifacts: string;
    codeVersion: string;
    codeRepo: string;
    comment: string;
    status: boolean;
    versionStatus: VersionStatus | string;
    updatedAt: Date;
    createdAt: Date;
    createdBy: string;
    project: string;
}

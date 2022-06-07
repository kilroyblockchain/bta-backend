import { Document } from 'mongoose';
import { IUser } from 'src/components/flo-user/user/interfaces/user.interface';
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
    VersionStatus: VersionStatus;
    updatedAt: Date;
    createdAt: Date;
    createdBy: IUser;
    projectId: string;
}

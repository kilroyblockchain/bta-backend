export interface IBcProjectVersion {
    id: string;
    versionName: string;
    logFilePath: string;
    logFileVersion: string;
    logFileBCHash: string;
    versionModel: string;
    noteBookVersion: string;
    testDataSets: string;
    testDatasetBCHash: string;
    trainDataSets: string;
    trainDatasetBCHash: string;
    aiModel: string;
    aiModelBcHash?: string;
    codeVersion: string;
    codeRepo: string;
    comment: string;
    versionStatus: string;
    status: boolean;
    project: string;
    entryUser: string;
}

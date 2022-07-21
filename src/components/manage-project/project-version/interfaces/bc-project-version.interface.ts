export interface IBcProjectVersion {
    id: string;
    versionName: string;
    logFilePath: string;
    logFileBCHash: string;
    noteBookVersion: string;
    testDataSetsUrl: string;
    testDatasetBCHash: string;
    trainDataSetsUrl: string;
    trainDatasetBCHash: string;
    aiModelUrl: string;
    aiModelBcHash: string;
    codeVersion: string;
    codeRepo: string;
    comment: string;
    versionStatus: string;
    status: boolean;
    project: IBcProject;
    entryUser: string;
}

export interface IBcProject {
    id: string;
    projectName: string;
}

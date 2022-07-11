export class CreateBcProjectVersionDto {
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
    artifacts: string;
    codeVersion: string;
    codeRepo: string;
    comment: string;
    versionStatus: string;
    status: boolean;
    project: string;
    entryUser: string;

    constructor(
        id: string,
        versionName: string,
        logFilePath: string,
        logFileVersion: string,
        logFileBCHash: string,
        versionModel: string,
        noteBookVersion: string,
        testDataSets: string,
        testDatasetBCHash: string,
        trainDataSets: string,
        trainDatasetBCHash: string,
        artifacts: string,
        codeVersion: string,
        codeRepo: string,
        comment: string,
        versionStatus: string,
        status: boolean,
        project: string,
        entryUser: string
    ) {
        this.id = id;
        this.versionName = versionName;
        this.logFilePath = logFilePath;
        this.logFileVersion = logFileVersion;
        this.logFileBCHash = logFileBCHash;
        this.versionModel = versionModel;
        this.noteBookVersion = noteBookVersion;
        this.testDataSets = testDataSets;
        this.testDatasetBCHash = testDatasetBCHash;
        this.trainDataSets = trainDataSets;
        this.trainDatasetBCHash = trainDatasetBCHash;
        this.artifacts = artifacts;
        this.codeVersion = codeVersion;
        this.codeRepo = codeRepo;
        this.comment = comment;
        this.versionStatus = versionStatus;
        this.status = status;
        this.project = project;
        this.entryUser = entryUser;
    }
}

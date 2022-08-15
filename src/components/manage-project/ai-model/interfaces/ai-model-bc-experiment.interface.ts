export interface IBcExperiment {
    experimentName: string;
    experimentBcHash: string;
    entryUser: string;
    modelVersion: IBcModelVersion;
    project: IBcProject;
}

export interface IBcModelVersion {
    id: string;
    versionName: string;
}

export interface IBcProject {
    id: string;
    projectName: string;
}

export interface IGetBcExperiment {
    experimentName: string;
    modelVersion: IGetModelVersion;
    project: IGetProject;
}

interface IGetModelVersion {
    id: string;
}

interface IGetProject {
    id: string;
}

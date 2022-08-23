export interface IBcArtifactModel {
    modelArtifactName: string;
    modelArtifactBcHash: string;
    modelVersion: IBcModelVersion;
    project: IBcProject;
    entryUser: string;
}

export interface IBcModelVersion {
    id: string;
    versionName: string;
}

export interface IBcProject {
    id: string;
    projectName: string;
}

export interface IGetBcArtifactModel {
    modelArtifactName: string;
    modelVersion: IGetModelVersion;
    project: IGetProject;
}

interface IGetModelVersion {
    id: string;
}

interface IGetProject {
    id: string;
}

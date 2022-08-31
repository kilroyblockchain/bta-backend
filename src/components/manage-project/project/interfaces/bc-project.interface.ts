export interface IBcProject {
    id: string;
    name: string;
    detail: string;
    members: string[];
    domain: string;
    status: boolean;
    modelVersions: IBcProjectVersion[];
    entryUser: string;
    createdBy: string;
    purposeDetail: IProjectDetail;
}

export interface IBcProjectVersion {
    id: string;
    versionName: string;
}

export interface IProjectDetail {
    purpose: string;
    docUrl: string;
    docName: string;
}

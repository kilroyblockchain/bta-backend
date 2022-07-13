export interface IBcProject {
    id: string;
    name: string;
    detail: string;
    members: string[];
    domain: string;
    status: boolean;
    projectVersions: IBcProjectVersion[];
    entryUser: string;
}

export interface IBcProjectVersion {
    id: string;
    versionName: string;
}

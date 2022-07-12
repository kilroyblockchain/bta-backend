import { Document } from 'mongoose';

export interface IProject extends Document {
    _id: string;
    name: string;
    details: string;
    members: string[];
    domain: string;
    purpose: IPurposeDoc;
    status: boolean;
    updatedAt: Date;
    createdAt: Date;
    createdBy: string;
    updatedBy: string;
    companyId: string;
    projectVersions: string[];
}

interface IPurposeDoc {
    text: string;
    docName: string;
    docURL: string;
}

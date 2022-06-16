import { Document } from 'mongoose';

export interface IMonitoringReport extends Document {
    _id: string;
    subject: string;
    description: string;
    documents: Array<IReportDocs>;
    updatedAt: Date;
    createdAt: Date;
    version: string;
    createdBy: string;
}

export interface IReportDocs {
    _id?: string;
    docURL: string;
    docName: string;
}

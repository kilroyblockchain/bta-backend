import { Document } from 'mongoose';

export interface IMonitoringReport extends Document {
    _id: string;
    subject: string;
    description: string;
    monitoringToolLink: string;
    documents: Array<IReportDocs>;
    updatedAt: Date;
    createdAt: Date;
    version: string;
    createdBy: string;
    staffing: string;
    status: string;
    otherStatus: string;
}

export interface IReportDocs {
    _id?: string;
    docURL: string;
    docName: string;
}

export interface IMonitoringStatus extends Document {
    _id: string;
    name: string;
}

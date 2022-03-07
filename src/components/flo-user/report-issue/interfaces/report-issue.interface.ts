import { Document } from 'mongoose';

export interface IReportIssue {
    issueType: string;
    companyName: string;
    description: string;
    email: string;
    proofAttachment: string;
    subscriptionType: string;
    status: string;
    checkedBy?: string;
}

export interface IReportIssueDoc extends Document {
    issueType: string;
    companyName: string;
    description: string;
    email: string;
    proofAttachment: string;
    subscriptionType: string;
    status: string;
    checkedBy?: string;
}

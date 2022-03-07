import { Document } from 'mongoose';
import { Organization } from '../../organization/interfaces/organization.interface';
import { IReportIssue } from '../../report-issue/interfaces/report-issue.interface';
import { IUser } from '../../user/interfaces/user.interface';

export interface ICompanyTransfer {
    currentOwner: string | IUser;
    company: string | Organization;
    transferTo: string;
    transferToken: string;
    expireIn: Date;
    isUsed: boolean;
    status: string;
    issue: string | IReportIssue;
    canRefresh: boolean;
}

export interface ICompanyTransferDoc extends Document {
    currentOwner: string | IUser;
    company: string | Organization;
    transferTo: string;
    transferToken: string;
    expireIn: Date;
    isUsed: boolean;
    status: string;
    issue: string | IReportIssue;
    canRefresh: boolean;
}

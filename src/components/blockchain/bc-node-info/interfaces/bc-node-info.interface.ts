import { Document } from 'mongoose';

export interface IBcNodeInfo extends Document {
    orgName: string;
    label: string;
    nodeUrl: string;
    status: boolean;
    authorizationToken: string;
    addedBy: string;
}

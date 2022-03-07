import { Document } from 'mongoose';
export interface OrganizationUnitInterface extends Document {
    companyID: string;
    unitName: string;
    unitDescription?: string;
    subscriptionType: string;
    featureListId?: [string];
    status: boolean;
}

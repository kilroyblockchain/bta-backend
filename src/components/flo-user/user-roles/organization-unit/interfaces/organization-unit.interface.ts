import { Document } from 'mongoose';
export interface IOrganizationUnitInterface extends Document {
    companyID: string;
    unitName: string;
    unitDescription?: string;
    subscriptionType: string;
    featureListId?: string[];
    status: boolean;
}

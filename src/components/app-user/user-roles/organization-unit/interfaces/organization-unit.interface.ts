import { Document } from 'mongoose';
import { IDocumentTimestamp } from 'src/@core/interfaces/timestamp.interface';
export interface IOrganizationUnitInterface extends Document, IDocumentTimestamp {
    companyID: string;
    unitName: string;
    unitDescription?: string;
    subscriptionType: string;
    featureListId?: string[];
    status: boolean;
    isMigrated: boolean;
}

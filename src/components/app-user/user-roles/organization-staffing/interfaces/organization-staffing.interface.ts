import { IFeature } from 'app-migrations/feature-migrate/interfaces/feature.interface';
import { Document } from 'mongoose';
import { IDocumentTimestamp } from 'src/@core/interfaces/timestamp.interface';
import { IOrganizationUnitInterface } from 'src/components/app-user/user-roles/organization-unit/interfaces/organization-unit.interface';
export interface StaffingInterface extends Document, IDocumentTimestamp {
    organizationUnitId: string;
    staffingName: string;
    featureAndAccess?: {
        featureId?: string | IFeature;
        accessType?: string[];
    }[];
    status?: boolean;
}

export interface IStaticUnitAndStaffing {
    unit: IOrganizationUnitInterface;
    staffs: Array<StaffingInterface>;
}

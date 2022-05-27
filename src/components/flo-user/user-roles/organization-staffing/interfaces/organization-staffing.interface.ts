import { IFeature } from 'flo-migrations/feature-migrate/interfaces/feature.interface';
import { Document } from 'mongoose';
import { IOrganizationUnitInterface } from 'src/components/flo-user/user-roles/organization-unit/interfaces/organization-unit.interface';
export interface StaffingInterface extends Document {
    organizationUnitId: string;
    staffingName: string;
    featureAndAccess?: [
        {
            featureId?: string | IFeature;
            accessType?: [string];
        }
    ];
    status?: boolean;
}

export interface IStaticUnitAndStaffing {
    unit: IOrganizationUnitInterface;
    staffs: Array<StaffingInterface>;
}

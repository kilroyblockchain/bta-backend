import { IFeature } from 'migrations/feature-migrate/interfaces/feature.interface';
import { Document } from 'mongoose';
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

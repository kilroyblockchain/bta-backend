import 'dotenv/config';
import { consoleLogWrapper } from 'app-migrations/helper-func';
import * as mongoose from 'mongoose';
import { StaffingInterface } from 'src/components/app-user/user-roles/organization-staffing/interfaces/organization-staffing.interface';
import { adminStaffingUnit } from 'super-admin-migrations/data/default-staffing-unit';
import { StaffingSchema } from 'src/components/app-user/user-roles/organization-staffing/schemas/organization-staffing.schema';

async function up(): Promise<void> {
    consoleLogWrapper('Creating admin staffing unit');
    const StaffingUnitModel = mongoose.model<StaffingInterface>('Staffing', StaffingSchema);
    const newStaffingUnit = new StaffingUnitModel(adminStaffingUnit);
    await newStaffingUnit.save();
    consoleLogWrapper('Successfully created a staffing unit: ' + newStaffingUnit.staffingName);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down(): Promise<void> {
    // Write migration here
}

module.exports = { up, down };

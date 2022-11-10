import 'dotenv/config';
import { consoleLogWrapper } from 'app-migrations/helper-func';
import { IOrganizationUnitInterface } from 'src/components/flo-user/user-roles/organization-unit/interfaces/organization-unit.interface';
import { OrganizationUnitSchema } from 'src/components/app-user/user-roles/organization-unit/schemas/organization-unit.schema';
import * as mongoose from 'mongoose';

async function up(): Promise<void> {
    try {
        const OrganizationUnitModel = mongoose.model<IOrganizationUnitInterface>('OrganizationUnit', OrganizationUnitSchema);
        consoleLogWrapper('Adding isMigrated filed in all organization units');

        const updateOrganizationUnit = await OrganizationUnitModel.updateMany({}, { $set: { isMigrated: true } });
        if (updateOrganizationUnit) {
            consoleLogWrapper('New filed isMigrated added in all organization units successfully');
        } else {
            consoleLogWrapper('Unable to Add New Field isMigrated ');
        }
    } catch (err) {
        consoleLogWrapper('Unable to Add New Field isMigrated: ' + err);
    }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down(): Promise<void> {
    // Write migration here
}

module.exports = { up, down };

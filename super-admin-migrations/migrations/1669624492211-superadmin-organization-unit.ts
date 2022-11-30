import 'dotenv/config';
import * as mongoose from 'mongoose';
import { OrganizationUnitSchema } from 'src/components/app-user/user-roles/organization-unit/schemas/organization-unit.schema';
import { IOrganizationUnitInterface } from 'src/components/flo-user/user-roles/organization-unit/interfaces/organization-unit.interface';
import { consoleLogWrapper } from 'app-migrations/helper-func';
import { adminOrganizationUnit } from 'super-admin-migrations/data/default-organization-unit';


async function up():  Promise<void> {
try {
    consoleLogWrapper('Creating admin organization unit');

    const OrganizationUnitModel = mongoose.model<IOrganizationUnitInterface>('OrganizationUnit', OrganizationUnitSchema);
    const newOrganizationUnit = new OrganizationUnitModel(adminOrganizationUnit);
    await newOrganizationUnit.save();
    consoleLogWrapper('Successfully created a organization unit: ' + newOrganizationUnit.unitName);
} catch (err) {
    console.log(err.message);

}}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down():  Promise<void> {
    // Write migration here
}

module.exports = { up, down };

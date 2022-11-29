import 'dotenv/config';
import { consoleLogWrapper } from 'app-migrations/helper-func';
import * as mongoose from 'mongoose';
import { IOrganization } from 'src/components/app-user/organization/interfaces/organization.interface';
import { OrganizationSchema } from 'src/components/app-user/organization/schemas/organization.schema';
import { adminCompany } from 'super-admin-migrations/data/defaultUser';

async function up(): Promise<void>  {
    const OrganizationModel = mongoose.model<IOrganization>('Organization', OrganizationSchema);

    consoleLogWrapper('Creating admin organization');
    const newOrganization = new OrganizationModel(adminCompany);
    await newOrganization.save();
    consoleLogWrapper('Successfully created a admin organization: ' + newOrganization.companyName);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down(): Promise<void>  {
    // Write migration here
}

module.exports = { up, down };

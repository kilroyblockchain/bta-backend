import { consoleLogWrapper } from 'migrations/helper-func';
import * as mongoose from 'mongoose';
import { IOrganization } from 'src/components/flo-user/organization/interfaces/organization.interface';
import { OrganizationSchema } from 'src/components/flo-user/organization/schemas/organization.schema';
import { IUser } from 'src/components/flo-user/user/interfaces/user.interface';
import { UserSchema } from 'src/components/flo-user/user/schemas/user.schema';
import { admin, adminCompany } from 'super-admin-migrations/data/defaultUser';

/**
 * Make any changes you need to make to the database here
 */
async function up(): Promise<void> {
    try {
        await createAdminUser();
    } catch (err) {
        console.error(err.message);
    }
}

async function createAdminUser(): Promise<void> {
    try {
        const UserModel = mongoose.model<IUser>('User', UserSchema);
        const OrganizationModel = mongoose.model<IOrganization>('Organization', OrganizationSchema);
        consoleLogWrapper('Creating admin organization');
        const newOrganization = new OrganizationModel(adminCompany);
        await newOrganization.save();
        consoleLogWrapper('Successfully created a admin organization: ' + newOrganization.companyName);
        consoleLogWrapper('Creating admin user');
        const newAdminUser = new UserModel(admin);
        await newAdminUser.save();
        consoleLogWrapper('Successfully created a admin user: ' + newAdminUser.firstName);
    } catch (err) {
        consoleLogWrapper(err);
        throw new Error('Failed to create an admin user, quitting...');
    }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down(): Promise<void> {
    // Write migration here
}

module.exports = { up, down };

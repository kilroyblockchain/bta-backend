import { consoleLogWrapper } from 'migrations/helper-func';
import * as mongoose from 'mongoose';
import { Organization } from 'src/components/flo-user/organization/interfaces/organization.interface';
import { OrganizationSchema } from 'src/components/flo-user/organization/schemas/organization.schema';
import { IUser } from 'src/components/flo-user/user/interfaces/user.interface';
import { UserSchema } from 'src/components/flo-user/user/schemas/user.schema';
import { admin, adminCompany } from 'super-admin-migrations/data/defaultUser';

/**
 * Make any changes you need to make to the database here
 */
async function up() {
    try {
        // Create an admin User
        await createAdminUser();
        // After creating user, create a disease
        // Create a Blog
        // await createBlogs();
        // Create a Workflow Resources
        // Create a Workflows
    } catch (err) {
        console.error(err.message);
    }
}

async function createAdminUser() {
    try {
        const UserModel = mongoose.model<IUser>('User', UserSchema);
        const OrganizationModel = mongoose.model<Organization>('Organization', OrganizationSchema);
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
async function down() {
    // Write migration here
}

module.exports = { up, down };

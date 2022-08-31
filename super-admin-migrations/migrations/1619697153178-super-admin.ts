import 'dotenv/config';
import { consoleLogWrapper } from 'app-migrations/helper-func';
import * as mongoose from 'mongoose';
import { IOrganization } from 'src/components/app-user/organization/interfaces/organization.interface';
import { OrganizationSchema } from 'src/components/app-user/organization/schemas/organization.schema';
import { StaffingInterface } from 'src/components/app-user/user-roles/organization-staffing/interfaces/organization-staffing.interface';
import { StaffingSchema } from 'src/components/app-user/user-roles/organization-staffing/schemas/organization-staffing.schema';
import { OrganizationUnitSchema } from 'src/components/app-user/user-roles/organization-unit/schemas/organization-unit.schema';
import { IUser } from 'src/components/app-user/user/interfaces/user.interface';
import { UserSchema } from 'src/components/app-user/user/schemas/user.schema';
import { IOrganizationUnitInterface } from 'src/components/flo-user/user-roles/organization-unit/interfaces/organization-unit.interface';
import { adminOrganizationUnit } from 'super-admin-migrations/data/default-organization-unit';
import { adminStaffingUnit } from 'super-admin-migrations/data/default-staffing-unit';
import { admin, adminCompany } from 'super-admin-migrations/data/defaultUser';
import axios from 'axios';

import { sendMail } from '../mail.helper';
import { MailTypes } from 'src/@utils/mail/enum/mail-type.enum';

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
        const OrganizationUnitModel = mongoose.model<IOrganizationUnitInterface>('OrganizationUnit', OrganizationUnitSchema);
        const StaffingUnitModel = mongoose.model<StaffingInterface>('Staffing', StaffingSchema);
        consoleLogWrapper('Creating admin organization');
        const newOrganization = new OrganizationModel(adminCompany);
        await newOrganization.save();
        consoleLogWrapper('Successfully created a admin organization: ' + newOrganization.companyName);
        consoleLogWrapper('Creating admin user');
        const newAdminUser = new UserModel(admin);
        await newAdminUser.save();
        consoleLogWrapper('Successfully created a admin user: ' + newAdminUser.firstName);
        consoleLogWrapper('Creating admin organization unit');
        const newOrganizationUnit = new OrganizationUnitModel(adminOrganizationUnit);
        await newOrganizationUnit.save();
        consoleLogWrapper('Successfully created a organization unit: ' + newOrganizationUnit.unitName);
        consoleLogWrapper('Creating admin staffing unit');
        const newStaffingUnit = new StaffingUnitModel(adminStaffingUnit);
        await newStaffingUnit.save();
        consoleLogWrapper('Successfully created a staffing unit: ' + newStaffingUnit.staffingName);
        consoleLogWrapper('Register Super admin user in blockchain');
        const response = await axios.post(process.env.REGISTER_SUPER_ADMIN_BC, '', {
            headers: {
                admin_token: process.env.BC_SUPER_ADMIN_REGISTRATION_TOKEN
            }
        });
        if (response.data) {
            const key = response.data.data.key;
            await sendMail(
                'Super Admin User Verification Credentials',
                admin.email,
                {
                    subscriptionType: newAdminUser.company[0].subscriptionType,
                    email: newAdminUser.email,
                    password: admin.password,
                    bcKey: key
                },
                MailTypes.GETTING_STARTED
            );
            consoleLogWrapper('Successfully Registered Super admin user in blockchain');
            consoleLogWrapper('The Verification Credentials Of Super Admin Is Send To The Mail');
        }
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

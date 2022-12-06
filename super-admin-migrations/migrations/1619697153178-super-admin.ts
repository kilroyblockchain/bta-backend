import 'dotenv/config';
import { consoleLogWrapper } from 'app-migrations/helper-func';
import * as mongoose from 'mongoose';
import { IUser } from 'src/components/app-user/user/interfaces/user.interface';
import { UserSchema } from 'src/components/app-user/user/schemas/user.schema';
import { admin } from 'super-admin-migrations/data/defaultUser';
import axios from 'axios';
import { ISuperAdminMigration } from '../interface/super-admin-migration.interface'

import { sendMail } from '../mail.helper';
import { MailTypes } from 'src/@utils/mail/enum/mail-type.enum';
import { SuperAdminMigrationSchema } from 'super-admin-migrations/schema/super-admin-migration.schema';

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

        consoleLogWrapper('Creating admin user');
        const newAdminUser = new UserModel(admin);
        await newAdminUser.save();
        consoleLogWrapper('Successfully created a admin user: ' + newAdminUser.email);

        consoleLogWrapper('Register Super admin user in blockchain');
        try {
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
            consoleLogWrapper(err.message);
            const SuperAdminMigrationModel = mongoose.model<ISuperAdminMigration>('super-admin-migrations', SuperAdminMigrationSchema);
            await SuperAdminMigrationModel.deleteOne({ name: "super-admin" });
            throw new Error('Failed to register super admin super in blockchain, quitting...');

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

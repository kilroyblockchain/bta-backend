import 'dotenv/config';
import { Types } from 'mongoose';
import { DEFAULT_COMPANY_ID, DEFAULT_SUPER_ADMIN_ID, STAFFING_UNIT_ID } from 'super-admin-migrations/constants/default-constant';

export const admin =
    /* 1 */
    {
        _id: DEFAULT_SUPER_ADMIN_ID,
        loginAttempts: 0,
        autoPassword: false,
        firstName: 'Suyog',
        lastName: 'Khanal',
        email: 'suraj@kilroyblockchain.com',
        phone: '+1 (488) 431-4341',
        country: new Types.ObjectId('60e6fe33d27e2133c4855221'),
        state: new Types.ObjectId('60e6fe3dd27e2133c4856174'),
        address: 'Quibusdam dolorem do',
        zipCode: '40465',
        jobTitle: 'Voluptatem atque vol',
        password: 'Kbc@2020',
        company: [
            {
                staffingId: [STAFFING_UNIT_ID],
                userAccept: true,
                default: true,
                verified: true,
                isAdmin: true,
                isDeleted: false,
                _id: new Types.ObjectId('60895385b0068f003fe9d0db'),
                companyId: DEFAULT_COMPANY_ID,
                subscriptionType: 'super-admin'
            }
        ],
        verificationExpires: new Date(),
        blockExpires: new Date(),
        verification: 'ff2fc9c8-b8e8-484d-8e0d-b053d1945ebe',
        resetLink: '',
        bcSalt: process.env.SUPER_ADMIN_BC_SALT
    };

export const adminCompany = {
    _id: DEFAULT_COMPANY_ID,
    companyName: 'Kilroy Blockchain',
    country: null,
    state: null,
    address: '',
    zipCode: '',
    aboutOrganization: ''
};

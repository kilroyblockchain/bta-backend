import { OTHER, STAFF, SUPER_ADMIN } from 'app-migrations/subscription-type-migrate/constants';
import { Types } from 'mongoose';

export enum SubscriptionTypeID {
    SUPER_ADMIN = '6020e66b93e1822970210001',
    OTHER = '6020e66b93e1822970210002',
    STAFF = '6020e66b93e1822970210003'
}

export const subscriptionTypes = [
    /* 1 */
    {
        _id: new Types.ObjectId(SubscriptionTypeID.SUPER_ADMIN),
        subscriptionTypeIdentifier: SUPER_ADMIN,
        subscriptionType: 'Super Admin',
        position: 0
    },

    /* 2 */
    {
        _id: new Types.ObjectId(SubscriptionTypeID.OTHER),
        subscriptionTypeIdentifier: OTHER,
        subscriptionType: 'Other',
        position: 2
    },

    /* 3 */
    {
        _id: new Types.ObjectId(SubscriptionTypeID.STAFF),
        subscriptionTypeIdentifier: STAFF,
        subscriptionType: 'Staff',
        position: 1
    }
];

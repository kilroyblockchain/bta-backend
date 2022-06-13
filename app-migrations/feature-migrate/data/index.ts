import { SubscriptionTypeID } from 'app-migrations/subscription-type-migrate/data';
import { Types } from 'mongoose';
import { ACCESS_TYPE } from 'src/@core/constants';
import { FEATURE_IDENTIFIER } from 'src/@core/constants';

export const superAdminFeatures = [
    /* 1 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0001'),
        accessType: [ACCESS_TYPE.READ, ACCESS_TYPE.WRITE, ACCESS_TYPE.UPDATE, ACCESS_TYPE.DELETE],
        subscriptionId: [new Types.ObjectId(SubscriptionTypeID.SUPER_ADMIN), new Types.ObjectId(SubscriptionTypeID.OTHER), new Types.ObjectId(SubscriptionTypeID.STAFF)],
        featureIdentifier: FEATURE_IDENTIFIER.MANAGE_ALL_USER,
        feature: 'Manage all users'
    },
    /* 2 */
    /**
     * Allocate 602102d7dfcf432c8c4f0002 - 602102d7dfcf432c8c4f1000
     * For Super admin, in 11th position 'b' is changed to 'c' to make unique id than generalFeatures
     */
    {
        _id: new Types.ObjectId('602102d7dfcf432c8c4f0002'),
        accessType: [ACCESS_TYPE.READ],
        subscriptionId: [new Types.ObjectId(SubscriptionTypeID.SUPER_ADMIN)],
        featureIdentifier: FEATURE_IDENTIFIER.APPLICATION_LOGS,
        feature: 'Application Logs'
    }
];

export const generalFeatures = [
    /* 2 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0002'),
        accessType: [ACCESS_TYPE.READ, ACCESS_TYPE.UPDATE],
        subscriptionId: [new Types.ObjectId(SubscriptionTypeID.SUPER_ADMIN), new Types.ObjectId(SubscriptionTypeID.OTHER), new Types.ObjectId(SubscriptionTypeID.STAFF)],
        featureIdentifier: FEATURE_IDENTIFIER.PERSONAL_DETAIL,
        feature: 'Personal Detail'
    },

    /* 3 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0003'),
        accessType: [ACCESS_TYPE.READ, ACCESS_TYPE.UPDATE],
        subscriptionId: [new Types.ObjectId(SubscriptionTypeID.SUPER_ADMIN), new Types.ObjectId(SubscriptionTypeID.OTHER), new Types.ObjectId(SubscriptionTypeID.STAFF)],
        featureIdentifier: FEATURE_IDENTIFIER.ORGANIZATION_DETAIL,
        feature: 'Organization Detail'
    },

    /* 4 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0004'),
        accessType: [ACCESS_TYPE.READ, ACCESS_TYPE.WRITE, ACCESS_TYPE.UPDATE, ACCESS_TYPE.DELETE],
        subscriptionId: [new Types.ObjectId(SubscriptionTypeID.SUPER_ADMIN), new Types.ObjectId(SubscriptionTypeID.OTHER), new Types.ObjectId(SubscriptionTypeID.STAFF)],
        featureIdentifier: FEATURE_IDENTIFIER.ORGANIZATION_UNIT,
        feature: 'Organization Unit'
    },

    /* 5 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0005'),
        accessType: [ACCESS_TYPE.READ, ACCESS_TYPE.WRITE, ACCESS_TYPE.UPDATE, ACCESS_TYPE.DELETE],
        subscriptionId: [new Types.ObjectId(SubscriptionTypeID.SUPER_ADMIN), new Types.ObjectId(SubscriptionTypeID.OTHER), new Types.ObjectId(SubscriptionTypeID.STAFF)],
        featureIdentifier: FEATURE_IDENTIFIER.ORGANIZATION_STAFFING,
        feature: 'Organization Staffing'
    },

    /* 6 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0006'),
        accessType: [ACCESS_TYPE.READ, ACCESS_TYPE.WRITE, ACCESS_TYPE.UPDATE, ACCESS_TYPE.DELETE],
        subscriptionId: [new Types.ObjectId(SubscriptionTypeID.SUPER_ADMIN), new Types.ObjectId(SubscriptionTypeID.OTHER), new Types.ObjectId(SubscriptionTypeID.STAFF)],
        featureIdentifier: FEATURE_IDENTIFIER.ORGANIZATION_USER,
        feature: 'Organization User'
    },
    /* 7 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0007'),
        accessType: [ACCESS_TYPE.READ],
        subscriptionId: [new Types.ObjectId(SubscriptionTypeID.SUPER_ADMIN), new Types.ObjectId(SubscriptionTypeID.OTHER), new Types.ObjectId(SubscriptionTypeID.STAFF)],
        featureIdentifier: FEATURE_IDENTIFIER.USER_ACTIVITY,
        feature: 'User Activity'
    },
    /* 8 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0008'),
        accessType: [ACCESS_TYPE.READ, ACCESS_TYPE.UPDATE],
        subscriptionId: [new Types.ObjectId(SubscriptionTypeID.SUPER_ADMIN), new Types.ObjectId(SubscriptionTypeID.OTHER), new Types.ObjectId(SubscriptionTypeID.STAFF)],
        featureIdentifier: FEATURE_IDENTIFIER.MANAGE_BLOCKED_COMPANY_USERS,
        feature: 'Manage Blocked Company Users'
    },
    /* 9 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0009'),
        accessType: [ACCESS_TYPE.WRITE],
        subscriptionId: [new Types.ObjectId(SubscriptionTypeID.SUPER_ADMIN), new Types.ObjectId(SubscriptionTypeID.OTHER), new Types.ObjectId(SubscriptionTypeID.STAFF)],
        featureIdentifier: FEATURE_IDENTIFIER.CHANGE_USER_PASSWORD,
        feature: 'Change user password'
    }
];

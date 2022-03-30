import { Types } from 'mongoose';
import { ACCESS_TYPE } from 'src/@core/constants';
import { FEATURE_IDENTIFIER } from 'src/@core/constants';

export const superAdminFeatures = [
    /* 1 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0001'),
        accessType: [ACCESS_TYPE.READ, ACCESS_TYPE.WRITE, ACCESS_TYPE.UPDATE, ACCESS_TYPE.DELETE],
        subscriptionId: [new Types.ObjectId('6020e66b93e1822970210001'), new Types.ObjectId('6020e66b93e1822970210002'), new Types.ObjectId('6020e66b93e1822970210003')],
        featureIdentifier: FEATURE_IDENTIFIER.MANAGE_ALL_USER,
        feature: 'Manage all users'
    }
];

export const generalFeatures = [
    /* 2 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0002'),
        accessType: [ACCESS_TYPE.READ, ACCESS_TYPE.UPDATE],
        subscriptionId: [new Types.ObjectId('6020e66b93e1822970210001'), new Types.ObjectId('6020e66b93e1822970210002'), new Types.ObjectId('6020e66b93e1822970210003')],
        featureIdentifier: FEATURE_IDENTIFIER.PERSONAL_DETAIL,
        feature: 'Personal Detail'
    },

    /* 3 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0003'),
        accessType: [ACCESS_TYPE.READ, ACCESS_TYPE.UPDATE],
        subscriptionId: [new Types.ObjectId('6020e66b93e1822970210001'), new Types.ObjectId('6020e66b93e1822970210002'), new Types.ObjectId('6020e66b93e1822970210003')],
        featureIdentifier: FEATURE_IDENTIFIER.ORGANIZATION_DETAIL,
        feature: 'Organization Detail'
    },

    /* 4 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0004'),
        accessType: [ACCESS_TYPE.READ, ACCESS_TYPE.WRITE, ACCESS_TYPE.UPDATE, ACCESS_TYPE.DELETE],
        subscriptionId: [new Types.ObjectId('6020e66b93e1822970210001'), new Types.ObjectId('6020e66b93e1822970210002'), new Types.ObjectId('6020e66b93e1822970210003')],
        featureIdentifier: FEATURE_IDENTIFIER.ORGANIZATION_UNIT,
        feature: 'Organization Unit'
    },

    /* 5 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0005'),
        accessType: [ACCESS_TYPE.READ, ACCESS_TYPE.WRITE, ACCESS_TYPE.UPDATE, ACCESS_TYPE.DELETE],
        subscriptionId: [new Types.ObjectId('6020e66b93e1822970210001'), new Types.ObjectId('6020e66b93e1822970210002'), new Types.ObjectId('6020e66b93e1822970210003')],
        featureIdentifier: FEATURE_IDENTIFIER.ORGANIZATION_STAFFING,
        feature: 'Organization Staffing'
    },

    /* 6 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0006'),
        accessType: [ACCESS_TYPE.READ, ACCESS_TYPE.WRITE, ACCESS_TYPE.UPDATE, ACCESS_TYPE.DELETE],
        subscriptionId: [new Types.ObjectId('6020e66b93e1822970210001'), new Types.ObjectId('6020e66b93e1822970210002'), new Types.ObjectId('6020e66b93e1822970210003')],
        featureIdentifier: FEATURE_IDENTIFIER.ORGANIZATION_USER,
        feature: 'Organization User'
    },
    /* 7 */
    {
        _id: new Types.ObjectId('602102d7dfbf432c8c4f0007'),
        accessType: [ACCESS_TYPE.READ],
        subscriptionId: [new Types.ObjectId('6020e66b93e1822970210001'), new Types.ObjectId('6020e66b93e1822970210002'), new Types.ObjectId('6020e66b93e1822970210003')],
        featureIdentifier: FEATURE_IDENTIFIER.USER_ACTIVITY,
        feature: 'User Activity'
    }
];

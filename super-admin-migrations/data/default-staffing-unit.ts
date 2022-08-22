import 'dotenv/config';
import { DEFAULT_BC_NODE_INFO_ID, GLOBAL_CHANNEL_ID, ORGANIZATION_UNIT_ID, STAFFING_UNIT_ID, superAdminFeaturesIds } from 'super-admin-migrations/constants/default-constant';

export const adminStaffingUnit = {
    _id: STAFFING_UNIT_ID,
    organizationUnitId: ORGANIZATION_UNIT_ID,
    staffingName: 'Super Admin Staffing',
    featureAndAccess: [
        {
            accessType: ['R', 'W', 'U', 'D'],
            featureId: superAdminFeaturesIds.MANAGE_ALL_USER
        },
        {
            accessType: ['R'],
            featureId: superAdminFeaturesIds.APPLICATION_LOGS
        },
        {
            accessType: ['R', 'U'],
            featureId: superAdminFeaturesIds.PERSONAL_DETAIL
        },
        {
            accessType: ['R', 'U'],
            featureId: superAdminFeaturesIds.ORGANIZATION_DETAIL
        },
        {
            accessType: ['R', 'W', 'U', 'D'],
            featureId: superAdminFeaturesIds.ORGANIZATION_UNIT
        },
        {
            accessType: ['R', 'W', 'U', 'D'],
            featureId: superAdminFeaturesIds.ORGANIZATION_STAFFING
        },
        {
            accessType: ['R', 'W', 'U', 'D'],
            featureId: superAdminFeaturesIds.ORGANIZATION_USER
        },
        {
            accessType: ['R'],
            featureId: superAdminFeaturesIds.USER_ACTIVITY
        },
        {
            accessType: ['R', 'U'],
            featureId: superAdminFeaturesIds.MANAGE_BLOCKED_COMPANY_USERS
        },
        {
            accessType: ['W'],
            featureId: superAdminFeaturesIds.CHANGE_USER_PASSWORD
        }
    ],
    bcNodeInfo: DEFAULT_BC_NODE_INFO_ID,
    channels: [GLOBAL_CHANNEL_ID],
    bucketUrl: process.env.SUPER_ADMIN_BUCKET_URL,
    oracleGroupName: 'Super Admin Staffing'.toLowerCase().replace(' ', '-')
};

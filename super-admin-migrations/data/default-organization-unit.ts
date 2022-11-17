import { DEFAULT_COMPANY_ID, ORGANIZATION_UNIT_ID, superAdminFeaturesIds } from 'super-admin-migrations/constants/default-constant';

export const adminOrganizationUnit = {
    _id: ORGANIZATION_UNIT_ID,
    companyID: DEFAULT_COMPANY_ID,
    unitName: 'Super Admin Organization',
    unitDescription: 'This is default super admin organization',
    subscriptionType: 'super-admin',
    isMigrated: true,
    featureListId: [
        superAdminFeaturesIds.MANAGE_ALL_USER,
        superAdminFeaturesIds.APPLICATION_LOGS,
        superAdminFeaturesIds.PERSONAL_DETAIL,
        superAdminFeaturesIds.ORGANIZATION_DETAIL,
        superAdminFeaturesIds.ORGANIZATION_UNIT,
        superAdminFeaturesIds.ORGANIZATION_STAFFING,
        superAdminFeaturesIds.ORGANIZATION_USER,
        superAdminFeaturesIds.USER_ACTIVITY,
        superAdminFeaturesIds.MANAGE_BLOCKED_COMPANY_USERS,
        superAdminFeaturesIds.CHANGE_USER_PASSWORD
    ]
};

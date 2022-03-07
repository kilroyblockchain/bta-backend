export default {
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
    MAIL_TYPES: {
        FORGET_PASSWORD_EMAIL: 'forget-password-email',
        SUBSCRIBER_EMAIL: 'subscriber-email',
        USER_ENABLE_EMAIL: 'user-enable-email',
        USER_DISABLE_EMAIL: 'user-disable-email',
        COMPANY_TRANSFER_EMAIL: 'company-transfer-email',
        ISSUE_REJECTED: 'issue-rejected',
        UNVERIFIED_USER_EMAIL: 'unverify-user-email',
        VACCINATED_USER_EMAIL: 'vaccinated-user',
        USER_ACCEPT_EMAIL: 'user-accept-email',
        SUBSCRIPTION_UPDATED: 'subscription-update',
        NOTIFY_SUPERVISOR: 'notify-supervisor',
        NOTIFY_POSITIVE_USER: 'notify-positive-user',
        ORGANIZATION_REJECTED: 'organization-rejected',
        TRIAND_DATA_IMPORT: 'triand-data-import',
        NOTIFY_IMPORT_COMPLETE: 'notify-import-complete'
    }
};

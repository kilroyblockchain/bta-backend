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
        USER_ACCEPT_EMAIL: 'user-accept-email',
        SUBSCRIPTION_UPDATED: 'subscription-update',
        ORGANIZATION_REJECTED: 'organization-rejected'
    }
};

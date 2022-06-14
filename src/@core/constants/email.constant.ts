const appName = process.env.APP_NAME ?? 'App';

export const EMAIL_CONSTANTS = {
    ORGANIZATION_VERIFIED: 'Organization verified by ' + appName,
    USER_CREATED: 'User created',
    USER_VERIFIED: 'User verified',
    TITLE_WELCOME: 'Welcome to ' + appName,
    TITLE_ACCOUNT_DISABLED: 'Account Disabled',
    TITLE_VACCINE_RECORD_DISABLED: 'Vaccine Record Disabled',
    FLO: 'FLo',
    FORGET_PASSWORD: 'Forget password',
    RESET_PASSWORD: 'Reset password',
    RESET_PASSWORD_LINK: 'Reset password link'
};

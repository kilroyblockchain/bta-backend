import { Types } from 'mongoose';

export const DEFAULT_COMPANY_ID = new Types.ObjectId('608a49c2899c17003f7d2576');
export const superAdminFeaturesIds = {
    MANAGE_ALL_USER: new Types.ObjectId('602102d7dfbf432c8c4f0001'),
    APPLICATION_LOGS: new Types.ObjectId('602102d7dfbf432c8c4f0002'),
    PERSONAL_DETAIL: new Types.ObjectId('602102d7dfbf432c8c4f0002'),
    ORGANIZATION_DETAIL: new Types.ObjectId('602102d7dfbf432c8c4f0003'),
    ORGANIZATION_UNIT: new Types.ObjectId('602102d7dfbf432c8c4f0004'),
    ORGANIZATION_STAFFING: new Types.ObjectId('602102d7dfbf432c8c4f0005'),
    ORGANIZATION_USER: new Types.ObjectId('602102d7dfbf432c8c4f0006'),
    USER_ACTIVITY: new Types.ObjectId('602102d7dfbf432c8c4f0007'),
    MANAGE_BLOCKED_COMPANY_USERS: new Types.ObjectId('602102d7dfbf432c8c4f0008'),
    CHANGE_USER_PASSWORD: new Types.ObjectId('602102d7dfbf432c8c4f0009')
};

export const STAFFING_UNIT_ID = new Types.ObjectId('608a49c2899c17003f7d2906');
export const ORGANIZATION_UNIT_ID = new Types.ObjectId('608a49c2899c17003f7d2976');
export const GLOBAL_CHANNEL_ID = new Types.ObjectId('607fb4f9eeef453aeb000001');

import { Document } from 'mongoose';
import { Organization } from '../../organization/interfaces/organization.interface';
import { StaffingInterface } from '../../user-roles/organization-staffing/interfaces/organization-staffing.interface';

export interface IUser extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country?: string;
    state?: string;
    city?: string;
    address?: string;
    zipCode?: string;
    company: Array<ICompany>;
    jobTitle: string;
    password: string;
    verification: string;
    verificationExpires: Date;
    loginAttempts?: number;
    blockExpires?: Date;
    resetLink?: string;
    autoPassword?: boolean;
    reCaptchaToken?: string;
    userId?: string;
    birthDate?: Date;
    skill?: Array<string>;
    language?: Array<string>;
    education?: Array<string>;
    experience?: Array<string>;
    sponsorOrganizationName?: string;
}

export interface ICompany {
    companyId: string | Organization;
    staffingId: Array<string | StaffingInterface>;
    deletedStaffingId?: Array<string>;
    subscriptionType: string;
    userAccept: boolean;
    default: boolean;
    verified: boolean;
    isAdmin: boolean;
    userAcceptToken?: string;
    isDeleted: boolean;
    isRejected?: boolean;
}

export interface ILoginCount {
    realtimeOnlineUserCount: number;
    todayLoginCount: number;
    lastWeekLoginCount: number;
    lastMonthLoginCount: number;
    last3MonthLoginCount: number;
    last6MonthLoginCount: number;
    lastYearLoginCount: number;
    totalLoginUserCount: number;
}

export interface IBasicUserInfo {
    id: string;
    defaultCompany: ICompany;
    companies: ICompany[];
    firstName: string;
    lastName: string;
    fullName: string;
}

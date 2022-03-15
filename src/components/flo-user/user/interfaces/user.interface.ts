import { Document } from 'mongoose';
import { IOrganization } from 'src/components/flo-user/organization/interfaces/organization.interface';
import { StaffingInterface } from 'src/components/flo-user/user-roles/organization-staffing/interfaces/organization-staffing.interface';

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
    blockchainVerified?: boolean;
}

export interface ICompany {
    companyId: string | IOrganization;
    staffingId: Array<string | StaffingInterface>;
    deletedStaffingId?: Array<string | StaffingInterface>;
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

export interface IReturnResponse {
    success: boolean;
    message: string;
}

export interface IUserCommonResponse {
    id: string;
    roles: Array<string>;
    firstName: string;
    lastName: string;
    email: string;
    companyId: string;
}

export interface IUserResponse extends IUserCommonResponse {
    autoPassword: boolean;
    companyName: string;
    staffingId: Array<string | StaffingInterface>;
    company: Array<ICompany>;
    accessToken?: string;
}

export interface IUserWithBlockchain extends IUserCommonResponse {
    _id?: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    address: string;
    zipCode: string;
    verified: boolean;
    blockchainVerified: boolean;
}

export interface IJWTUserData {
    company: {
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
        companyId: string;
    };
    blockchainVerified: boolean;
}
export interface ICompanyAdmin {
    currentOwner: string;
    company: string;
}

export interface IUserData {
    firstName: string;
    lastName: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
}

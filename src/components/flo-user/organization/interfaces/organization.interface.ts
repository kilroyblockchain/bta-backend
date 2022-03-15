import { Document } from 'mongoose';
import { ROLE } from 'src/@core/constants';

export interface ISubscription {
    type: ROLE;
    status: boolean;
}

export interface IOrganization extends Document {
    companyName: string;
    companyLogo?: string;
    country?: string;
    state?: string;
    city?: string;
    address?: string;
    zipCode?: string;
    email?: string;
    reCaptchaToken?: string;
    isDeleted: boolean;
    isRejected?: boolean;
    subscription: Array<ISubscription>;
    blockchainVerified?: boolean;
}

export interface IBaseOrganization {
    companyName: string;
    country: string;
    state: string;
    city: string;
    address: string;
    zipCode: string;
    companyLogo: string;
    subscription: Array<ISubscription>;
}
export interface IOrganizationResponse extends IBaseOrganization {
    id: string;
}

export interface IOrganizationInit extends IBaseOrganization {
    image: string;
}

export interface ICompanyDto {
    companyName: string;
    companyCountry: string;
    companyState: string;
    companyCity: string;
    companyAddress: string;
    companyZipCode: string;
    companyLogo: string;
    image: string;
    subscriptionType: ROLE;
}

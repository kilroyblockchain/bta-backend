import { Document } from 'mongoose';
import { ROLE } from 'src/@core/constants';

export interface ISubscription {
    type: ROLE;
    status: boolean;
}

export interface ICompanyVaccine {
    disease: string;
    availableVaccines: Array<string>;
}

export interface Organization extends Document {
    companyName: string;
    companyLogo?: string;
    country?: string;
    state?: string;
    city?: string;
    address?: string;
    zipCode?: string;
    aboutOrganization?: string;
    contributionForApp?: string;
    helpNeededFromApp?: string;
    email?: string;
    reCaptchaToken?: string;
    isDeleted: boolean;
    isRejected?: boolean;
    subscription: Array<ISubscription>;
    vaccines?: Array<ICompanyVaccine>;
}

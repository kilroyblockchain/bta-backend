import { Document } from 'mongoose';
import { Organization } from 'src/components/flo-user/organization/interfaces/organization.interface';

export interface ICompanyBranch extends Document {
    companyId?: string | Organization;
    addedBy?: string;
    branchId?: string;
    name: string;
    country: string;
    state: string;
    address: string;
    zipCode: string;
    status: boolean;
    localName: string;
    city: string;
    phone: string;
    fax: string;
    districtId: string;
    districtStateName: string;
    address2: string;
    address3?: string;
    regionId: string;
    regionName: string;
    usState: string;
    useInReport?: boolean;
    blockchainVerified?: boolean;
    blockchainStatus?: boolean;
}

export interface ICompanyBranchResponse {
    id: string;
    companyId: string | Organization;
    addedBy: string;
    branchId?: string;
    name: string;
    country: string;
    state: string;
    address: string;
    zipCode: string;
    status: boolean;
    localName: string;
    city: string;
    phone: string;
    fax: string;
    districtId: string;
    districtStateName: string;
    address2: string;
    address3?: string;
    regionId: string;
    regionName: string;
    usState: string;
    useInReport: boolean;
    blockchainVerified?: boolean;
    blockchainStatus?: boolean;
}

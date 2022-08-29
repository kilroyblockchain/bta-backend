import { Request } from 'express';

export interface ICompanyAdminOrganizationPayload {
    companyId: string;
    bcNodeInfo: string;
    channels: string[];
    bucketUrl: string;
    organizationName: string;
    staffingType: string;
    userId: string;
    req: Request;
}

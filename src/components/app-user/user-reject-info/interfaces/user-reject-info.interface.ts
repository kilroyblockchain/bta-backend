import { Document } from 'mongoose';
import { ICompany, IUser } from '../../user/interfaces/user.interface';

export interface IUserRejectInformation extends Document {
    rejectedUser?: string | IUser;
    rejectedOrganization?: string | ICompany;
    rejectedBy: string | IUser;
    description?: string;
    blockchainVerified?: boolean;
    createdAt: Date;
}

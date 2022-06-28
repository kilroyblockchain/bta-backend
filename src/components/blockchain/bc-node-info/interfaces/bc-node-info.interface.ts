import { Document } from 'mongoose';
import { IUser } from 'src/components/app-user/user/interfaces/user.interface';

export interface IBcNodeInfo extends Document {
    orgName: string;
    label: string;
    nodeUrl: string;
    status: boolean;
    authorizationToken: string;
    addedBy: IUser;
}

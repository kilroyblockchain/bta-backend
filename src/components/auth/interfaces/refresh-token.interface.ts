import { IUser } from 'src/components/app-user/user/interfaces/user.interface';
import { Document } from 'mongoose';

export interface IRefreshToken extends Document {
    userId: IUser | string;
    refreshToken: string;
    ip: string;
    browser: string;
    country: string;
    expireIn: Date;
    revoke: Date;
    revokeIp: string;
    company: string;
    createdAt: Date;
}

export interface IUserActivityResponse {
    userId: string;
    firstName: string;
    lastName: string;
    loggedInDate: Date;
    loggedOutDate: Date;
    company: string;
    email: string;
    phone: string;
    organization: {
        id: string;
        name: string;
    };
}

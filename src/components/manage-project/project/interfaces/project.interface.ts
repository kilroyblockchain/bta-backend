import { Document } from 'mongoose';

export interface IProject extends Document {
    _id: string;
    name: string;
    details: string;
    members: string[];
    domain: string;
    purpose: string;
    status: boolean;
    updatedAt: Date;
    createdAt: Date;
    createdBy: string;
}

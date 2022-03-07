import { Document } from 'mongoose';

export interface ISkill extends Document {
    _id: string;
    createdBy: string;
    title: string;
    status: boolean;
}

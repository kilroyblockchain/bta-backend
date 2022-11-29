import { Document } from 'mongoose';

export interface ISuperAdminMigration extends Document {
    _id: string;
    state: string;
    name: string;
    createdAt: Date;
    __v: number
}

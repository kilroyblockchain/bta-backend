import { Document } from 'mongoose';

export interface IExperience extends Document {
    _id: string;
    userId: string;
    title: string;
    employmentType: string;
    company: string;
    location: string;
    startDate: Date;
    endDate?: Date;
    status: boolean;
}

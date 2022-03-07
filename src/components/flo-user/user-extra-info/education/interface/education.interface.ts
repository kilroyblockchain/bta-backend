import { Document } from 'mongoose';

export interface IEducation extends Document {
    _id: string;
    userId: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    grade?: string;
    startYear: number;
    endYear?: number;
    status: boolean;
}

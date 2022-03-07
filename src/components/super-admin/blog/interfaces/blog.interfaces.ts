import { Document } from 'mongoose';

export interface Blog extends Document {
    _id: string;
    title: string;
    userId: string;
    url: string;
    content: string;
}

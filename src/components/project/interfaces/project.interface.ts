import { Document } from 'mongoose';
import { ProjectStatusEnum } from '../enum/project-status.enum';

export interface IProject extends Document {
    _id: string;
    name: string;
    detail: string;
    members: string[];
    domain: string;
    version: string;
    purpose: string;
    projectStatus: ProjectStatusEnum;
    status: boolean;
}

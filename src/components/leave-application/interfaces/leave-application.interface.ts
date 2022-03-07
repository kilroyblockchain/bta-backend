import { Document } from 'mongoose';

export interface ILeaveResponse {
    leaveStatus: string;
    date: Date;
    respondedBy: string;
    comment: string;
    signature: string;
}

export interface ILeaveApplication extends Document {
    addedBy: string;
    company: string;
    signature: string;
    status: boolean;
    isDeleted: boolean;
    leaveFrom: Date;
    leaveTo: Date;
    numberOfHours: number;
    leaveType: string;
    response?: Array<ILeaveResponse>;
}

export interface ILeaveApplicationResponse {
    id: string;
    signature: string;
    status: boolean;
    leave_From: Date;
    leave_To: Date;
    number_Of_Hours: number;
    response: Array<{
        leave_status: string;
        date: Date;
        comment: string;
        signature: string;
    }>;
    leave_Type: string;
}

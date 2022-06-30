import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import * as mongoose from 'mongoose';

export const MonitoringReportSchema = new Schema(
    {
        subject: {
            type: String,
            minlength: 2,
            maxlength: 40,
            required: true
        },
        description: {
            type: String,
            minlength: 2,
            maxlength: 255
        },
        documents: [
            {
                docURL: { type: String },
                docName: { type: String }
            }
        ],
        version: {
            type: mongoose.Types.ObjectId,
            ref: 'project-version'
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        staffing: {
            type: String
        },
        status: {
            type: mongoose.Types.ObjectId,
            ref: 'monitoring-status'
        },
        otherStatus: {
            type: String
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

MonitoringReportSchema.plugin(mongoosePaginate);

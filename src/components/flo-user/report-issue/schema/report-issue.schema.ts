import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { STATUS } from 'src/@core/constants';

export const ReportIssueSchema = new Schema(
    {
        issueType: {
            type: String,
            required: true
        },
        companyName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        proofAttachment: {
            type: String,
            required: true
        },
        subscriptionType: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: STATUS.PENDING
        },
        approvedBy: {
            type: String
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
ReportIssueSchema.plugin(mongoosePaginate);

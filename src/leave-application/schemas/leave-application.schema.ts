import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { LEAVE_STATUS } from 'src/@core/constants/leave-status.enum';

export const LeaveApplicationSchema = new Schema(
    {
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: true
        },
        status: {
            type: Boolean,
            default: true
        },
        signature: {
            type: String,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        leaveFrom: {
            type: Date,
            required: true
        },
        leaveTo: {
            type: Date,
            required: true
        },
        numberOfHours: {
            type: Number,
            required: true
        },
        response: [
            {
                leaveStatus: {
                    type: String,
                    enum: LEAVE_STATUS
                },
                date: {
                    type: Date
                },
                respondedBy: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                comment: {
                    type: String
                },
                signature: {
                    type: String
                }
            }
        ],
        leaveType: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

LeaveApplicationSchema.plugin(mongoosePaginate);

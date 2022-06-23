import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const VerificationSchema = new Schema(
    {
        email: {
            type: String,
            minlength: 5,
            maxlength: 255,
            required: true
        },
        userName: {
            type: String
        },
        userAcceptToken: {
            type: String
        },
        requestedBy: {
            type: String
        },
        subscriptionType: {
            type: String
        },
        roles: {
            type: String
        },
        userAccept: {
            type: Boolean,
            default: true,
            required: true
        },
        timeStamp: {
            type: Date,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
VerificationSchema.plugin(mongoosePaginate);

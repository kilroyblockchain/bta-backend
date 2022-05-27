import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const RefreshTokenSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        },
        ip: {
            type: String,
            required: true
        },
        browser: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        expireIn: {
            type: Date,
            required: true
        },
        revoke: {
            type: Date,
            required: false
        },
        revokeIp: {
            type: String,
            required: false
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
RefreshTokenSchema.plugin(mongoosePaginate);

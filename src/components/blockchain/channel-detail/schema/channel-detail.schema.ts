import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const ChannelDetailSchema = new Schema(
    {
        channelName: {
            type: String,
            required: true,
            unique: true
        },
        connectionProfileName: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            default: true
        },
        isDefault: {
            type: Boolean,
            default: false
        },
        isCompanyChannel: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

ChannelDetailSchema.plugin(mongoosePaginate);

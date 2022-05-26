import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const ChannelMappingSchema = new Schema(
    {
        channelId: {
            type: Schema.Types.ObjectId,
            ref: 'channel',
            required: true
        },
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: 'company',
            required: true
        },
        staffingId: {
            type: Schema.Types.ObjectId,
            ref: 'staffing',
            required: false
        },
        walletId: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

ChannelMappingSchema.plugin(mongoosePaginate);

import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const BlogSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId
        },
        title: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

BlogSchema.plugin(mongoosePaginate);

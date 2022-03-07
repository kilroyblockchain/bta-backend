import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const languageSchema = new Schema(
    {
        createdBy: {
            type: Schema.Types.ObjectId,
            trim: true
        },
        title: {
            type: String,
            trim: true,
            unique: true,
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

languageSchema.plugin(mongoosePaginate);

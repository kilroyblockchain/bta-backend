import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const skillSchema = new Schema(
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

skillSchema.plugin(mongoosePaginate);

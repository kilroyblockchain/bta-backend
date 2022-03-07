import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const experienceSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            trim: true,
            required: true
        },
        title: {
            type: String,
            trim: true,
            required: true
        },
        employmentType: {
            type: String,
            trim: true,
            required: true
        },
        company: {
            type: String,
            trim: true,
            required: true
        },
        location: {
            type: String,
            trim: true,
            required: true
        },
        startDate: {
            type: Date,
            trim: true,
            required: true
        },
        endDate: {
            type: Date,
            trim: true
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

experienceSchema.plugin(mongoosePaginate);

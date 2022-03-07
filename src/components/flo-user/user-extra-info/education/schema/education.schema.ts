import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const educationSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            trim: true,
            required: true
        },
        school: {
            type: String,
            trim: true,
            required: true
        },
        degree: {
            type: String,
            trim: true,
            required: true
        },
        fieldOfStudy: {
            type: String,
            trim: true,
            required: true
        },
        grade: {
            type: String,
            trim: true
        },
        startYear: {
            type: Number,
            trim: true,
            required: true
        },
        endYear: {
            type: Number,
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

educationSchema.plugin(mongoosePaginate);

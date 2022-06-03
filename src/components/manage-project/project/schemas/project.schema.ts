import * as mongoosePaginate from 'mongoose-paginate';
import * as mongoose from 'mongoose';

mongoose.set('strictPopulate', false);

export const ProjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: 2,
            maxlength: 40,
            required: true
        },
        details: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        domain: {
            type: String,
            minlength: 2,
            maxlength: 40,
            required: true
        },
        purpose: {
            type: String,
            maxlength: 40
        },
        status: {
            type: Boolean,
            default: true
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

ProjectSchema.plugin(mongoosePaginate);

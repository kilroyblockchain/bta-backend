import * as mongoosePaginate from 'mongoose-paginate';
import * as mongoose from 'mongoose';
import { ProjectStatusEnum } from '../enum/project-status.enum';

mongoose.set('strictPopulate', false);

export const ProjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: 2,
            maxlength: 40,
            required: true
        },
        detail: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }
        ],
        domain: {
            type: String,
            minlength: 2,
            maxlength: 40,
            required: true
        },
        version: {
            type: String,
            minlength: 2,
            maxlength: 40,
            required: true
        },
        purpose: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true
        },
        projectStatus: {
            type: String,
            enum: Object.values(ProjectStatusEnum),
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

ProjectSchema.plugin(mongoosePaginate);

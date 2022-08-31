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
            maxlength: 255
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
            maxlength: 40
        },
        purpose: {
            text: { type: String },
            docURL: { type: String },
            docName: { type: String }
        },
        status: {
            type: Boolean,
            default: true
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        updatedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        companyId: {
            type: mongoose.Types.ObjectId,
            ref: 'Organization'
        },
        projectVersions: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'project-version'
            }
        ]
    },
    {
        versionKey: false,
        timestamps: true
    }
);

ProjectSchema.plugin(mongoosePaginate);

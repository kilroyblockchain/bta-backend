import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { VersionStatus } from '../enum/version-status.enum';

mongoose.set('strictPopulate', false);

export const ProjectVersionSchema = new Schema(
    {
        versionName: {
            type: String,
            required: true
        },
        logFilePath: {
            type: String,
            minlength: 2,
            required: true
        },
        logFileVersion: {
            type: String,
            required: true
        },
        logFileBCHash: {
            type: String
        },
        versionModel: {
            type: String,
            required: true
        },
        noteBookVersion: {
            type: String,
            required: true
        },
        testDataSets: {
            type: String,
            required: true
        },
        testDatasetBCHash: {
            type: String
        },
        trainDataSets: {
            type: String
        },
        trainDatasetBCHash: {
            type: String
        },
        artifacts: {
            type: String
        },
        aiModelBcHash: {
            type: String
        },
        codeVersion: {
            type: String,
            required: true
        },
        codeRepo: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        versionStatus: {
            type: String,
            enum: Object.values(VersionStatus),
            default: VersionStatus.DRAFT
        },
        status: {
            type: Boolean,
            default: true
        },
        submittedDate: {
            type: Date
        },
        reviewedDate: {
            type: Date
        },
        productionDate: {
            type: Date
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        project: {
            type: mongoose.Types.ObjectId,
            ref: 'Project'
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

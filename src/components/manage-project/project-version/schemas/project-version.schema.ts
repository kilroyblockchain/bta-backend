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
            type: String,
            required: true
        },
        trainDatasetBCHash: {
            type: String
        },
        artifacts: {
            type: String,
            required: true
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
        VersionStatus: {
            type: String,
            enum: Object.values(VersionStatus),
            default: VersionStatus.PENDING
        },
        status: {
            type: Boolean,
            default: true
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        projectId: {
            type: mongoose.Types.ObjectId,
            ref: 'Project'
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

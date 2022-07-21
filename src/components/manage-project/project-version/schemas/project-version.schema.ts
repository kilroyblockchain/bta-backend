import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { OracleBucketDataStatus, VersionStatus } from '../enum/version-status.enum';

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
        logFileBCHash: {
            type: String
        },
        logFileStatus: {
            message: { type: String },
            code: {
                type: String,
                enum: Object.values(OracleBucketDataStatus),
                default: OracleBucketDataStatus.FETCHING
            }
        },
        noteBookVersion: {
            type: String,
            required: true
        },
        testDataSets: {
            type: String,
            required: true
        },
        testDatasetStatus: {
            message: { type: String },
            code: {
                type: String,
                enum: Object.values(OracleBucketDataStatus),
                default: OracleBucketDataStatus.FETCHING
            }
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
        trainDatasetStatus: {
            message: { type: String },
            code: {
                type: String,
                enum: Object.values(OracleBucketDataStatus),
                default: OracleBucketDataStatus.FETCHING
            }
        },
        aiModel: {
            type: String
        },
        aiModelBcHash: {
            type: String
        },
        aiModelStatus: {
            message: { type: String },
            code: {
                type: String,
                enum: Object.values(OracleBucketDataStatus),
                default: OracleBucketDataStatus.FETCHING
            }
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

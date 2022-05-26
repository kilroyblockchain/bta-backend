import * as mongoosePaginate from 'mongoose-paginate';
import * as mongoose from 'mongoose';

mongoose.set('strictPopulate', false);

export const ExperimentSchema = new mongoose.Schema(
    {
        projectVersion: {
            type: String,
            minlength: 2,
            maxlength: 20,
            required: true
        },
        experimentVersion: {
            type: String,
            minlength: 2,
            maxlength: 20,
            required: true
        },
        codeVersion: {
            type: String,
            minlength: 2,
            maxlength: 20,
            required: true
        },
        codeRepoLink: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true
        },
        notebookVersion: {
            type: String,
            minlength: 2,
            maxlength: 20,
            required: true
        },
        model: {
            type: String,
            minlength: 2,
            maxlength: 500,
            required: true
        },
        trainDataSetLink: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true
        },
        testDataSetLink: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true
        },
        framework: {
            type: String,
            minlength: 2,
            maxlength: 50,
            required: true
        },
        frameworkVersion: {
            type: String,
            minlength: 2,
            maxlength: 20,
            required: true
        },
        logFileLink: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true
        },
        parameters: {
            type: String,
            minlength: 2,
            maxlength: 500,
            required: true
        },
        performanceMetrics: {
            type: String,
            minlength: 2,
            maxlength: 500,
            required: true
        },
        status: {
            type: Boolean,
            default: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

ExperimentSchema.plugin(mongoosePaginate);

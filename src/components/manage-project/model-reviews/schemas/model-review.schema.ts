import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const ModelReviewSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            default: 0,
            max: 5
        },
        version: {
            type: mongoose.Types.ObjectId,
            ref: 'project-version'
        },
        documents: [
            {
                docURL: { type: String },
                docName: { type: String }
            }
        ],
        reviewModel: {
            type: mongoose.Types.ObjectId,
            ref: 'project-version'
        },
        deployedModelURL: {
            type: String
        },
        deployedModelInstruction: {
            type: String
        },
        productionURL: {
            type: String
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        staffing: {
            type: String
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

ModelReviewSchema.plugin(mongoosePaginate);

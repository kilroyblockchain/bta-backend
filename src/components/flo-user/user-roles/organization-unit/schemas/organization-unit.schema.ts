import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import * as mongoose from 'mongoose';

export const OrganizationUnitSchema = new Schema(
    {
        companyID: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: true
        },
        unitName: {
            type: String,
            required: true
        },
        unitDescription: {
            type: String
        },
        subscriptionType: {
            type: String,
            required: true
        },
        featureListId: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'feature',
                required: true
            }
        ],
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
OrganizationUnitSchema.index({ companyID: 1, unitName: 1 }, { unique: true });
OrganizationUnitSchema.plugin(mongoosePaginate);

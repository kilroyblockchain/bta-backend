import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const StaffingSchema = new Schema(
    {
        organizationUnitId: {
            type: Schema.Types.ObjectId,
            ref: 'OrganizationUnit',
            required: true
        },
        staffingName: {
            type: String,
            required: true
        },
        featureAndAccess: [
            {
                featureId: {
                    type: Schema.Types.ObjectId,
                    ref: 'feature',
                    required: true
                },
                accessType: { type: [String], required: true }
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
StaffingSchema.index({ organizationUnitId: 1, staffingName: 1 }, { unique: true });
StaffingSchema.plugin(mongoosePaginate);

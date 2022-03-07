import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const companyBranchSchema = new Schema(
    {
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: true
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        branchId: {
            type: String,
            trim: true
        },
        name: {
            type: String,
            trim: true,
            required: true
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: 'Countries',
            default: null,
            required: false
        },
        state: {
            type: Schema.Types.ObjectId,
            ref: 'States',
            default: null,
            required: false
        },
        address: {
            type: String,
            required: false
        },
        zipCode: {
            type: String
        },
        status: {
            type: Boolean,
            default: true
        },
        localName: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        phone: {
            type: String,
            required: false
        },
        fax: {
            type: String,
            required: false
        },
        districtId: {
            type: String,
            required: false
        },
        districtStateName: {
            type: String,
            required: false
        },
        address2: {
            type: String,
            required: false
        },
        address3: {
            type: String,
            required: false
        },
        regionId: {
            type: String,
            required: false
        },
        regionName: {
            type: String,
            required: false
        },
        usState: {
            type: String,
            required: false
        },
        useInReport: {
            type: Boolean,
            default: true
        },
        blockchainStatus: {
            type: Boolean,
            default: false
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

companyBranchSchema.index({ companyId: 1, name: 1 }, { unique: true });

companyBranchSchema.plugin(mongoosePaginate);

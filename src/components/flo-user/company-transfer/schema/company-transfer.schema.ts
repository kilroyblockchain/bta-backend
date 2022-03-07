import { Schema } from 'mongoose';
import { STATUS } from 'src/@core/constants/status.enum';
import * as mongoosePaginate from 'mongoose-paginate';

export const CompanyTransferSchema = new Schema(
    {
        currentOwner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: true
        },
        transferTo: {
            type: String,
            required: true
        },
        transferToken: {
            type: String,
            required: true
        },
        isUsed: {
            type: Boolean,
            default: false,
            required: true
        },
        expireIn: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: STATUS.PENDING
        },
        issue: {
            type: Schema.Types.ObjectId,
            ref: 'report',
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
CompanyTransferSchema.set('toObject', { virtuals: true });
CompanyTransferSchema.set('toJSON', { virtuals: true });
CompanyTransferSchema.virtual('canRefresh').get(function () {
    if (this.expireIn < new Date() && this.status === STATUS.PENDING && !this.isUsed) {
        return true;
    } else {
        return false;
    }
});
CompanyTransferSchema.plugin(mongoosePaginate);

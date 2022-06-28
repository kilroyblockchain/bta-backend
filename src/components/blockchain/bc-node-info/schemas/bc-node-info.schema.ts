import * as mongoosePaginate from 'mongoose-paginate';
import * as mongoose from 'mongoose';

mongoose.set('strictPopulate', false);

export const BcNodeInfoSchema = new mongoose.Schema(
    {
        orgName: {
            type: String,
            minlength: 2,
            maxlength: 40,
            required: true
        },
        label: {
            type: String,
            minlength: 2,
            maxlength: 40,
            required: true
        },
        nodeUrl: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true
        },
        authorizationToken: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true
        },
        status: {
            type: Boolean,
            default: true
        },
        addedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

BcNodeInfoSchema.plugin(mongoosePaginate);

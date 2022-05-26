import * as mongoosePaginate from 'mongoose-paginate';
import * as mongoose from 'mongoose';

mongoose.set('strictPopulate', false);

export const ParticipantSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            minlength: 2,
            maxlength: 40,
            required: true,
            unique: true
        },
        organizationName: {
            type: String,
            minlength: 2,
            maxlength: 40,
            required: false
        },
        bcNodeUrl: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true
        },
        instanceName: {
            type: String,
            minlength: 2,
            maxlength: 40,
            required: true
        },
        oracleBucketUrl: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true
        },
        status: {
            type: Boolean,
            default: true
        },
        channelDetail: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'channelDetail'
            }
        ]
    },
    {
        versionKey: false,
        timestamps: true
    }
);

ParticipantSchema.plugin(mongoosePaginate);

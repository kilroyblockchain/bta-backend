import * as mongoosePaginate from 'mongoose-paginate';
import * as mongoose from 'mongoose';

mongoose.set('strictPopulate', false);

export const UserMappingSchema = new mongoose.Schema(
    {
        walletId: {
            type: String,
            minlength: 2,
            maxlength: 100,
            required: true,
            unique: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        participant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'participant'
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

UserMappingSchema.plugin(mongoosePaginate);

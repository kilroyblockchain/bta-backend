import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const UserRejectInformationSchema = new Schema(
    {
        rejectedUser: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rejectedOrganization: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: true
        },
        rejectedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        description: {
            type: String
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

UserRejectInformationSchema.plugin(mongoosePaginate);

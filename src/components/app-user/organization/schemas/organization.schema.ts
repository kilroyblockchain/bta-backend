import { Schema } from 'mongoose';

export const OrganizationSchema = new Schema(
    {
        companyName: {
            type: String,
            minlength: 2,
            maxlength: 255,
            unique: true,
            required: true
        },
        companyLogo: {
            type: String,
            required: false
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: 'Countries',
            required: false
        },
        state: {
            type: Schema.Types.ObjectId,
            ref: 'States',
            required: false
        },
        city: {
            type: String,
            required: false
        },
        address: {
            type: String,
            required: false
        },
        zipCode: {
            type: String,
            required: false
        },
        isDeleted: {
            type: Boolean,
            required: false,
            default: true
        },
        isRejected: {
            type: Boolean,
            default: false
        },
        subscription: [
            {
                type: {
                    type: String,
                    required: true
                },
                status: {
                    type: Boolean,
                    default: true,
                    required: true
                }
            }
        ]
    },
    {
        versionKey: false,
        timestamps: true
    }
);

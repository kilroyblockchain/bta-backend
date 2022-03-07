import { Schema } from 'mongoose';

export const CountrySchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId
        },
        idNumber: {
            type: Number
        },
        name: {
            type: String,
            unique: true
        },
        countryCode: {
            type: String,
            unique: true
        },
        phoneCode: {
            type: Number
        },
        states: [
            {
                type: Schema.Types.ObjectId,
                ref: 'States'
            }
        ]
    },
    {
        versionKey: false,
        timestamps: true
    }
);

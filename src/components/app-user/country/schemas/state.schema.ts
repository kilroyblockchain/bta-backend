import { Schema } from 'mongoose';

export const StateSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    idNumber: {
        type: Number
    },
    name: {
        type: String
    },
    abbreviation: {
        type: String
    },
    countryId: {
        type: Number
    },
    countryObjectId: {
        type: Schema.Types.ObjectId,
        ref: 'Countries'
    },
    country: {
        type: Number
    }
});

StateSchema.index(
    { abbreviation: 1, countryId: 1 },
    {
        unique: true,
        partialFilterExpression: { abbreviation: { $exists: true, $not: '' } }
    }
);

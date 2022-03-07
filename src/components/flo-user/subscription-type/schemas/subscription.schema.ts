import * as mongoose from 'mongoose';

export const SubscriptionSchema = new mongoose.Schema({
    subscriptionTypeIdentifier: {
        type: String,
        required: true,
        unique: true
    },
    subscriptionType: {
        type: String,
        required: true,
        unique: true
    },
    position: {
        type: Number
    }
});

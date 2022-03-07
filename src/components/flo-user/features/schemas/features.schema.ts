import * as mongoose from 'mongoose';

export const FeatureSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Types.ObjectId
        },
        subscriptionId: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'subscription',
                required: true
            }
        ],
        featureIdentifier: {
            type: String,
            required: true
        },
        feature: {
            type: String,
            required: true
        },
        accessType: [
            {
                type: String
            }
        ]
    },
    { _id: false }
);

FeatureSchema.index({ subscriptionId: 1, featureIdentifier: 1 }, { unique: true });

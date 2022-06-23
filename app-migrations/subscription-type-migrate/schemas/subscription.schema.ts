import { ISubscription } from 'app-migrations/subscription-type-migrate/interfaces/subscription.interface';
import * as mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Types.ObjectId
        },
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
            type: Number,
            default: 0
        }
    },
    { _id: false }
);

export default mongoose.model<ISubscription>('subscription', SubscriptionSchema);

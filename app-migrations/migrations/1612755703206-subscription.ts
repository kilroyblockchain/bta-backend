import { subscriptionTypes as localSubscriptionTypes } from 'flo-migrations/subscription-type-migrate/data';
import { subscriptionTypesProd } from 'flo-migrations/subscription-type-migrate/data/index.prod';
import SubscriptionModel from 'flo-migrations/subscription-type-migrate/schemas/subscription.schema';
import { consoleLogWrapper, dropCollectionIfExist } from 'flo-migrations/helper-func';
import { mongooseConnection } from 'flo-migrations/migrate';

async function up(): Promise<void> {
    const subscriptionTypes = process.env.ENVIRONMENT === 'prod' ? subscriptionTypesProd : localSubscriptionTypes;
    try {
        const collectionName = 'subscriptions';
        await dropCollectionIfExist((await mongooseConnection).connection, collectionName);
        for (const subsType of subscriptionTypes) {
            const newSubType = new SubscriptionModel(subsType);
            await newSubType.save();
        }
        consoleLogWrapper('Successfully Migrated subscription types.');
    } catch (err) {
        console.error(err.message);
    }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down(): Promise<void> {
    // Write migration here
}

module.exports = { up, down };

import FeatureModel from 'flo-migrations/feature-migrate/schemas/feature.schema';
import { generalFeatures, superAdminFeatures } from 'flo-migrations/feature-migrate/data';
import { featureProduction } from 'flo-migrations/feature-migrate/data/index.prod';
import { consoleLogWrapper, dropCollectionIfExist } from 'flo-migrations/helper-func';
import { mongooseConnection } from 'flo-migrations/migrate';

async function up(): Promise<void> {
    try {
        const featuresLocal = [...superAdminFeatures, ...generalFeatures];
        const features = process.env.ENVIRONMENT === 'prod' ? featureProduction : featuresLocal;
        const collectionName = 'features';
        await dropCollectionIfExist((await mongooseConnection).connection, collectionName);
        for (const feature of features) {
            const newFeature = new FeatureModel(feature);
            await newFeature.save();
        }
        consoleLogWrapper('Successfully added all feature list from data.');
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

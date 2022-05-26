import FeatureModel from 'flo-migrations/feature-migrate/schemas/feature.schema';
import { generalFeatures, superAdminFeatures } from 'flo-migrations/feature-migrate/data';
import { featureProduction } from 'flo-migrations/feature-migrate/data/index.prod';
import { consoleLogWrapper } from 'flo-migrations/helper-func';

async function up(): Promise<void> {
    try {
        const featuresLocal = [...superAdminFeatures, ...generalFeatures];
        const features = process.env.ENVIRONMENT === 'prod' ? featureProduction : featuresLocal;
        if (!(await FeatureModel.find()).length) {
            for (const feature of features) {
                const newFeature = new FeatureModel(feature);
                await newFeature.save();
            }
            consoleLogWrapper('Successfully added all feature list from data.');
        } else {
            consoleLogWrapper('Already migrated feature list.');
        }
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

import FeatureModel from 'migrations/feature-migrate/schemas/feature.schema';
import { generalFeatures, scscoopFeatures, superAdminFeatures } from 'migrations/feature-migrate/data';
import { featureProduction } from 'migrations/feature-migrate/data/index.prod';
import { consoleLogWrapper } from 'migrations/helper-func';

async function up() {
    try {
        const featuresLocal = [...superAdminFeatures, ...generalFeatures, scscoopFeatures];
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
async function down() {
    // Write migration here
}

module.exports = { up, down };

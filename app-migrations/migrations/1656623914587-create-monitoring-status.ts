import MonitoringStatusModel from 'app-migrations/monitoring-status-migrate/schemas/monitoring-status.schema';
import { monitoringStatus } from 'app-migrations/monitoring-status-migrate/data';
import { monitoringStatusProduction } from 'app-migrations/monitoring-status-migrate/data/index.prod';
import { consoleLogWrapper, dropCollectionIfExist } from 'app-migrations/helper-func';
import { mongooseConnection } from 'app-migrations/migrate';

async function up(): Promise<void> {
    try {
        const statuses = process.env.ENVIRONMENT === 'prod' ? monitoringStatusProduction : monitoringStatus;
        const collectionName = 'monitoring-statuses';
        await dropCollectionIfExist((await mongooseConnection).connection, collectionName);
        for (const status of statuses) {
            const newStatus = new MonitoringStatusModel(status);
            await newStatus.save();
        }

        consoleLogWrapper('Successfully Migrated Monitoring Status');
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down(): Promise<void> {
    // Write migration here
}

module.exports = { up, down };

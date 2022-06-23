import * as migrateMongoose from 'migrate-mongoose';
import * as mongoose from 'mongoose';
import 'dotenv/config';
import { join } from 'path';
import { buildMongoURI, consoleLogWrapper, dropCollectionIfExist } from './helper-func';

const mongoURI = buildMongoURI(process.env.MONGO_URI, process.env.DATABASE_NAME, process.env.MONGO_HOST, process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD);

export const mongooseConnection = mongoose.connect(mongoURI);

const migrationsDir = join(__dirname, 'migrations'),
    dbUrl = mongoURI,
    collectionName = 'migrations',
    autosync = true;

const migrator = new migrateMongoose({
    migrationsPath: migrationsDir, // Path to migrations directory
    dbConnectionUri: dbUrl, // mongo url
    collectionName: collectionName, // collection name to use for migrations (defaults to 'migrations')
    autosync: autosync // if making a CLI app, set this to false to prompt the user, otherwise true
});
consoleLogWrapper('Starting Migration...');

const runMigrator = async (migrator: migrateMongoose): Promise<void> => {
    try {
        const collectionName = 'migrations';
        await dropCollectionIfExist((await mongooseConnection).connection, collectionName);
        await migrator.run('up');
        consoleLogWrapper('Completed Migrations. \nThank You!!!');
    } catch (err) {
        console.log(err);
    } finally {
        process.exit();
    }
};

runMigrator(migrator);

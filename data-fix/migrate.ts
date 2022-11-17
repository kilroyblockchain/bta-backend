import 'dotenv/config';
import * as migrateMongoose from 'migrate-mongoose';
import * as mongoose from 'mongoose';
import { join } from 'path';
import { buildMongoURI, consoleLogWrapper } from 'app-migrations/helper-func';

const mongoURI = buildMongoURI(process.env.MONGO_URI, process.env.DATABASE_NAME, process.env.MONGO_HOST, process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD);
mongoose.connect(mongoURI);
const migrationsDir = join(__dirname, 'migrations'),
    dbUrl = mongoURI,
    collectionName = 'data-fix-migrations',
    autosync = true;

const migrator = new migrateMongoose({
    migrationsPath: migrationsDir, // Path to migrations directory
    dbConnectionUri: dbUrl, // mongo url
    collectionName: collectionName, // collection name to use for migrations (defaults to 'migrations')
    autosync: autosync // if making a CLI app, set this to false to prompt the user, otherwise true
});

consoleLogWrapper('Starting Data Fix Migration...');
migrator
    .run('up')
    .then(() => {
        consoleLogWrapper('Completed Migrations. \nThank You!!!');
    })
    .finally(() => {
        process.exit();
    });

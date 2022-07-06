import * as mongoose from 'mongoose';
import { IBcNodeInfo } from 'src/components/blockchain/bc-node-info/interfaces/bc-node-info.interface';
import { BcNodeInfoSchema } from 'src/components/blockchain/bc-node-info/schemas/bc-node-info.schema';
import { bcNodeInfoData } from 'app-migrations/bc-node-info-migrate/data';
import { consoleLogWrapper, dropCollectionIfExist } from 'app-migrations/helper-func';
import { mongooseConnection } from 'app-migrations/migrate';

async function up(): Promise<void> {
    try {
        const BcNodeInfoModel = mongoose.model<IBcNodeInfo>('BcNodeInfo', BcNodeInfoSchema);
        const collectionName = 'bcnodeinfos';
        await dropCollectionIfExist((await mongooseConnection).connection, collectionName);
        const bcNodeInfo = new BcNodeInfoModel(bcNodeInfoData);
        await bcNodeInfo.save();

        consoleLogWrapper('Successfully created a default Bc Node Info ' + bcNodeInfo.orgName);
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

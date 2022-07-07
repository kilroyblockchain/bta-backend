import * as mongoose from 'mongoose';
import { IChannelDetail } from 'src/components/blockchain/channel-detail/interfaces/channel-detail.interface';
import { ChannelDetailSchema } from 'src/components/blockchain/channel-detail/schema/channel-detail.schema';
import { channelDetailData } from 'app-migrations/channel-detail-migrate/data';
import { consoleLogWrapper, dropCollectionIfExist } from 'app-migrations/helper-func';
import { mongooseConnection } from 'app-migrations/migrate';

/**
 * Make any changes you need to make to the database here
 */
async function up(): Promise<void> {
    const ChannelDetailModel = mongoose.model<IChannelDetail>('ChannelDetail', ChannelDetailSchema);
    try {
        const collectionName = 'channeldetails';
        await dropCollectionIfExist((await mongooseConnection).connection, collectionName);
        const channelDetail = new ChannelDetailModel(channelDetailData);
        await channelDetail.save();
        consoleLogWrapper('Successfully created a default channel detail ' + channelDetail.channelName);
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

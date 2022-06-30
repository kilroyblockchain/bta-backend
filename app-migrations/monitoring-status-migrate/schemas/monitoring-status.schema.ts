import { IMonitoringStatus } from 'app-migrations/monitoring-status-migrate/interfaces/monitoring-status.interface';
import * as mongoose from 'mongoose';

const MonitoringStatusSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Types.ObjectId
        },
        name: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        _id: false
    }
);

export default mongoose.model<IMonitoringStatus>('monitoring-status', MonitoringStatusSchema);

import * as mongoose from 'mongoose';

export const MonitoringStatusSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

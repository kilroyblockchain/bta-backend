import * as mongoose from 'mongoose';

export const AiModelTempHashSchema = new mongoose.Schema(
    {
        hash: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

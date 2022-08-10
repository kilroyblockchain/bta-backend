import * as mongoose from 'mongoose';

export const AiArtifactsModel = new mongoose.Schema(
    {
        modelNo: {
            type: String
        },
        modelBcHash: {
            type: String
        },
        version: {
            type: mongoose.Types.ObjectId,
            ref: 'project-version'
        },
        project: {
            type: mongoose.Types.ObjectId,
            ref: 'Project'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

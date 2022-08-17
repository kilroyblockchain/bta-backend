import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

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

AiArtifactsModel.plugin(mongoosePaginate);

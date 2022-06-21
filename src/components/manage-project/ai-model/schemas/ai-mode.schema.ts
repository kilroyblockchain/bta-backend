import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const AiModelSchema = new mongoose.Schema(
    {
        expNo: {
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

AiModelSchema.plugin(mongoosePaginate);

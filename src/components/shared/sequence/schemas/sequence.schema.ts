import { model, Schema } from 'mongoose';

export const SequenceSchema = new Schema(
    {
        organizationId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        organizationCode: {
            type: String,
            required: true
        },
        module: {
            type: String,
            required: true,
            unique: true
        },
        currentSeq: {
            type: Number,
            required: true,
            default: 1
        },
        incrementBy: {
            type: Number,
            required: true,
            default: 1
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
SequenceSchema.index({ organizationId: 1, module: 1 }, { unique: true });

export default model('sequence', SequenceSchema);

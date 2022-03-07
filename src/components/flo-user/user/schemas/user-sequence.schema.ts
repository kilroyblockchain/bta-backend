import { model, Schema } from 'mongoose';

export const UserSequenceSchema = new Schema(
    {
        organizationId: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true
        },
        organizationCode: {
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

export default model('User-sequence', UserSequenceSchema);

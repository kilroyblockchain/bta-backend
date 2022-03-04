import { ICaseyFeature } from 'migrations/feature-migrate/interfaces/casey-feature.interface';
import * as mongoose from 'mongoose';

const CaseyFeatureSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
    },
    subscriptionId: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'subscription',
        required: true,
      },
    ],
    featureIdentifier: {
      type: String,
      required: true,
      unique: true,
    },
    feature: {
      type: String,
      required: true,
    },
    accessType: [
      {
        type: String,
      },
    ],
  },
  { _id: false },
);

export default mongoose.model<ICaseyFeature>(
  'caseyFeature',
  CaseyFeatureSchema,
);

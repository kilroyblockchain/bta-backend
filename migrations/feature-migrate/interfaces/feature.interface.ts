import { Document, Types } from 'mongoose';

export interface IFeature extends Document {
  _id: Types.ObjectId;
  subscriptionId: Array<Types.ObjectId>;
  featureIdentifier: string;
  feature: string;
  accessType?: Array<any>;
}

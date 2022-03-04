import {
  OTHER,
  STAFF,
  SUPER_ADMIN,
} from 'migrations/subscription-type-migrate/constants';
import { Types } from 'mongoose';

export const subscriptionTypes = [
  /* 1 */
  {
    _id: new Types.ObjectId('6020e66b93e1822970210001'),
    subscriptionTypeIdentifier: SUPER_ADMIN,
    subscriptionType: 'Super Admin',
    position: 0,
  },

  /* 2 */
  {
    _id: new Types.ObjectId('6020e66b93e1822970210002'),
    subscriptionTypeIdentifier: OTHER,
    subscriptionType: 'Other',
    position: 2,
  },

  /* 3 */
  {
    _id: new Types.ObjectId('6020e66b93e1822970210003'),
    subscriptionTypeIdentifier: STAFF,
    subscriptionType: 'Staff',
    position: 1,
  },
];

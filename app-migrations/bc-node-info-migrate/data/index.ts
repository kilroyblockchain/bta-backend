import 'dotenv/config';
import { Types } from 'mongoose';
import { DEFAULT_SUPER_ADMIN_ID } from 'super-admin-migrations/constants/default-constant';

export const bcNodeInfoData = {
    _id: new Types.ObjectId('60e6fe3dd27e2133c4855255'),
    orgName: process.env.BC_NODE_ORG_NAME,
    label: process.env.BC_NODE_LABEL,
    nodeUrl: process.env.BC_NODE_URL,
    authorizationToken: process.env.BC_NODE_AUTHORIZATION,
    addedBy: DEFAULT_SUPER_ADMIN_ID,
    isMigrated: true
};

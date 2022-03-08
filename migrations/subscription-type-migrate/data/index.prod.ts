import { subscriptionTypes } from '.';
import { STAFF, SUPER_ADMIN } from '../constants';

const acceptedSubsctiptions = [SUPER_ADMIN, STAFF];
export const subscriptionTypesProd = subscriptionTypes.filter((subscriptionType) => acceptedSubsctiptions.some((subscriptionTypeIdentifier) => subscriptionTypeIdentifier === subscriptionType.subscriptionTypeIdentifier));

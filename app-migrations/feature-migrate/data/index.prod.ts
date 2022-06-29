import { btaFeatures, generalFeatures, superAdminFeatures } from '.';

export const featureProduction = [...superAdminFeatures, ...generalFeatures, ...btaFeatures];

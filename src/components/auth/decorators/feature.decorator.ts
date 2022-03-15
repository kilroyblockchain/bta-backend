import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Feature = (...feature: string[]): CustomDecorator<string> => SetMetadata('feature', feature);

import { BaseEmailDto } from './email.dto';

export class SubscriptionUpdatedBodyContextDto {
    email: string;
    currentCompany: string;
    newSubscription: string[];
    removedSubscription: string[];
}

export class SubscriptionUpdatedEmailDto extends BaseEmailDto<SubscriptionUpdatedBodyContextDto> {}

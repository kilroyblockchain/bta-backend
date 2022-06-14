import { BaseEmailDto } from './email.dto';

export class SubscriptionUpdatedBodyContextDto {
    email: string;
    currentCompany: string;
    newSubscription: string[];
    removedSubscription: string[];

    constructor({ email, currentCompany, newSubscription, removedSubscription }) {
        this.email = email;
        this.currentCompany = currentCompany;
        this.newSubscription = newSubscription;
        this.removedSubscription = removedSubscription;
    }
}

export class SubscriptionUpdatedEmailDto extends BaseEmailDto<SubscriptionUpdatedBodyContextDto> {
    constructor({ to, title, subject, partialContext }) {
        super({ to, title, subject });
        this.partialContext = partialContext;
    }
}

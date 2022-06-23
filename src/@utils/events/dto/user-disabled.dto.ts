import { BaseEmailDto } from './email.dto';

export class UserDisabledBodyContextDto {
    subscriptionType: string;
    email: string;
    type: string;

    constructor({ subscriptionType, email, type }) {
        this.subscriptionType = subscriptionType;
        this.email = email;
        this.type = type;
    }
}

export class UserDisabledEmailDto extends BaseEmailDto<UserDisabledBodyContextDto> {
    constructor({ to, title, subject, partialContext }) {
        super({ to, title, subject });
        this.partialContext = partialContext;
    }
}

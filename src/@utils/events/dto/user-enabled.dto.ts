import { BaseEmailDto } from './email.dto';

export class UserEnabledBodyContextDto {
    subscriptionType: string;
    email: string;
    clientAppURL: string;
    type: string;

    constructor({ email, subscriptionType, clientAppURL, type }) {
        this.email = email;
        this.subscriptionType = subscriptionType;
        this.clientAppURL = clientAppURL;
        this.type = type;
    }
}

export class UserEnabledEmailDto extends BaseEmailDto<UserEnabledBodyContextDto> {
    constructor({ to, title, subject, partialContext }) {
        super({ to, title, subject });
        this.partialContext = partialContext;
    }
}

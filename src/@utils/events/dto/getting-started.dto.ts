import { BaseEmailDto } from './email.dto';

export class GettingStartedBodyContextDto {
    subscriptionType: string;
    email: string;
    password: string;
    clientAppURL: string;
    bcKey: string;

    constructor({ subscriptionType, email, password, clientAppURL }, bcKey?) {
        this.subscriptionType = subscriptionType;
        this.email = email;
        this.password = password;
        this.clientAppURL = clientAppURL;
        this.bcKey = bcKey;
    }
}

export class GettingStartedEmailDto extends BaseEmailDto<GettingStartedBodyContextDto> {
    constructor({ to, title, subject, partialContext }) {
        super({ to, title, subject });
        this.partialContext = partialContext;
    }
}

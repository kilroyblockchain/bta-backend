import { BaseEmailDto } from './email.dto';

export class GettingStartedBodyContextDto {
    subscriptionType: string;
    email: string;
    password: string;
    clientAppURL: string;

    constructor({ subscriptionType, email, password, clientAppURL }) {
        this.subscriptionType = subscriptionType;
        this.email = email;
        this.password = password;
        this.clientAppURL = clientAppURL;
    }
}

export class GettingStartedEmailDto extends BaseEmailDto<GettingStartedBodyContextDto> {
    constructor({ to, title, subject, partialContext }) {
        super();
        this.to = to;
        this.title = title;
        this.subject = subject;
        this.partialContext = partialContext;
    }
}

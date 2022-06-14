import { BaseEmailDto } from './email.dto';

export class UserAcceptedBodyContextDto {
    email: string;
    requestedBy: string;
    userName: string;
    roles: string;
    subscriptionType: string;
    activationLink: string;

    constructor({ email, requestedBy, userName, roles, subscriptionType, activationLink }) {
        this.email = email;
        this.requestedBy = requestedBy;
        this.userName = userName;
        this.roles = roles;
        this.subscriptionType = subscriptionType;
        this.activationLink = activationLink;
    }
}

export class UserAcceptedEmailDto extends BaseEmailDto<UserAcceptedBodyContextDto> {
    constructor({ to, title, subject, partialContext }) {
        super({ to, title, subject });
        this.partialContext = partialContext;
    }
}

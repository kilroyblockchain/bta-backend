import { BaseEmailDto } from './email.dto';

export class UserAcceptedBodyContextDto {
    email: string;
    requestedBy: string;
    userName: string;
    roles: string;
    subscriptionType: string;
    activationLink: string;
}

export class UserAcceptedEmailDto extends BaseEmailDto<UserAcceptedBodyContextDto> {}

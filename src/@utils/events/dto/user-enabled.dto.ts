import { BaseEmailDto } from './email.dto';

export class UserEnabledBodyContextDto {
    subscriptionType: string;
    email: string;
    clientAppURL: string;
    type: string;
}

export class UserEnabledEmailDto extends BaseEmailDto<UserEnabledBodyContextDto> {}

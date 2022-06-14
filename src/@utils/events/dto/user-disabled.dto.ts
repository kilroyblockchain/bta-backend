import { BaseEmailDto } from './email.dto';

export class UserDisabledBodyContextDto {
    subscriptionType: string;
    email: string;
    type: string;
}

export class UserDisabledEmailDto extends BaseEmailDto<UserDisabledBodyContextDto> {}

import { BaseEmailDto } from './email.dto';

export class ForgetPasswordBodyContextDto {
    userFirstName: string;
    forgetPasswordLink: string;
}

export class ForgetPasswordEmailDto extends BaseEmailDto<ForgetPasswordBodyContextDto> {}

import { BaseEmailDto } from './email.dto';

export class ForgetPasswordBodyContextDto {
    userFirstName: string;
    forgetPasswordLink: string;

    constructor({ userFirstName, forgetPasswordLink }) {
        this.userFirstName = userFirstName;
        this.forgetPasswordLink = forgetPasswordLink;
    }
}

export class ForgetPasswordEmailDto extends BaseEmailDto<ForgetPasswordBodyContextDto> {
    constructor({ to, title, subject, partialContext }) {
        super({ to, title, subject });
        this.partialContext = partialContext;
    }
}

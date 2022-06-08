import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
// import { MailTypes } from 'src/@utils/mail/enum/mail-type.enum';
import { MailService } from 'src/@utils/mail/mail.service';
import { IUser } from 'src/components/flo-user/user/interfaces/user.interface';
import { FORGOT_PASSWORD } from '../constants/events.constants';

@Injectable()
export class ForgotPasswordEvent {
    constructor(private readonly config: ConfigService, private readonly mailService: MailService) {}

    @OnEvent(FORGOT_PASSWORD, { async: true })
    async handle(user: IUser): Promise<void> {
        console.log(user);
        // this.mailService.sendMail(user.email, 'Reset password', 'Reset password', MailTypes.forgotPassword, {
        //     code: user.resetPasswordToken,
        //     url: `${this.config.get('FE_URL')}/reset-password?token=${encodeURIComponent(user.resetPasswordToken)}`
        // });
    }
}

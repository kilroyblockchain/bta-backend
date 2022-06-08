import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { MailTypes } from 'src/@utils/mail/enum/mail-type.enum';
import { MailService } from 'src/@utils/mail/mail.service';
import { IUser } from 'src/components/flo-user/user/interfaces/user.interface';
import { RESENT_ACTIVATION, USER_REGISTERED } from '../constants/events.constants';

@Injectable()
export class UserRegisteredEvent {
    constructor(private readonly config: ConfigService, private readonly mailService: MailService) {}

    @OnEvent(USER_REGISTERED, { async: true })
    async handleUserRegistered(user: IUser): Promise<void> {
        const notifyClient = this.config.get('NOTIFY_CLIENT_USER_REGISTRATION') === 'true';
        this.userActivationEmail(user);
        if (notifyClient) {
            this.clientNotificationEmail(user);
        }
    }

    @OnEvent(RESENT_ACTIVATION, { async: true })
    async handleResendActivation(user: IUser): Promise<void> {
        this.userActivationEmail(user);
    }

    userActivationEmail(user: IUser): void {
        console.log(user);
        // this.mailService.sendMail(user.email, `Email verification link`, 'Activate your account', MailTypes.userActivation, {
        //     code: user.activateToken,
        //     url: `${this.config.get('BE_URL')}users/activate?token=${encodeURIComponent(user.activateToken)}`
        // });
    }

    clientNotificationEmail(user: IUser): void {
        const fullName = `${user.firstName} ${user.lastName}`;
        this.mailService.sendMail(this.config.get('CLIENT_EMAIL'), `A new user ${fullName} is registered`, 'User Registered', MailTypes.clientNotification, {
            name: fullName,
            email: user.email
        });
    }
}

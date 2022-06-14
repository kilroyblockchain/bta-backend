import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailTypes } from 'src/@utils/mail/enum/mail-type.enum';
import { FORGET_PASSWORD, ORGANIZATION_REJECTED, SUBSCRIPTION_UPDATED, USER_ACCEPTED, USER_DISABLED, USER_ENABLED, USER_REGISTERED } from '../constants/events.constants';
import { ForgetPasswordEmailDto, GettingStartedEmailDto, UserEnabledEmailDto, UserDisabledEmailDto, SubscriptionUpdatedEmailDto, OrganizationRejectedEmailDto, UserAcceptedEmailDto } from '../dto';
import { UserEventService } from '../services/user-event.service';

@Injectable()
export class UserEvent {
    constructor(private userEventService: UserEventService) {}

    @OnEvent(USER_REGISTERED, { async: true })
    handleUserRegistered(payload: GettingStartedEmailDto): void {
        console.log('User registered');
        this.userEventService.sendMail(MailTypes.GETTING_STARTED, payload);
    }

    @OnEvent(FORGET_PASSWORD, { async: true })
    handleForgetPassword(payload: ForgetPasswordEmailDto): void {
        this.userEventService.sendMail(MailTypes.FORGET_PASSWORD, payload);
    }

    @OnEvent(USER_ENABLED, { async: true })
    handleUserEnable(payload: UserEnabledEmailDto): void {
        this.userEventService.sendMail(MailTypes.USER_ENABLED, payload);
    }

    @OnEvent(USER_DISABLED, { async: true })
    handleUserDisable(payload: UserDisabledEmailDto): void {
        this.userEventService.sendMail(MailTypes.USER_DISABLED, payload);
    }

    @OnEvent(SUBSCRIPTION_UPDATED, { async: true })
    handleSubscriptionUpdate(payload: SubscriptionUpdatedEmailDto): void {
        this.userEventService.sendMail(MailTypes.SUBSCRIPTION_UPDATED, payload);
    }

    @OnEvent(ORGANIZATION_REJECTED, { async: true })
    handleOrganizationRejected(payload: OrganizationRejectedEmailDto): void {
        this.userEventService.sendMail(MailTypes.ORGANIZATION_REJECTED, payload);
    }

    @OnEvent(USER_ACCEPTED, { async: true })
    handleUserAccept(payload: UserAcceptedEmailDto): void {
        this.userEventService.sendMail(MailTypes.USER_ACCEPTED, payload);
    }
}

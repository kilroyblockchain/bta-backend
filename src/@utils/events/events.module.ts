import { forwardRef, Module } from '@nestjs/common';
import { MailModule } from 'src/@utils/mail/mail.module';
import { ForgotPasswordEvent } from './handlers/forgot.password.event';
import { UserRegisteredEvent } from './handlers/user.registered.event';

@Module({
    imports: [forwardRef(() => MailModule)],
    providers: [UserRegisteredEvent, ForgotPasswordEvent]
})
export class EventsModule {}

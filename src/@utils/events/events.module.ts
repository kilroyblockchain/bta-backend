import { forwardRef, Global, Module } from '@nestjs/common';
import { MailModule } from 'src/@utils/mail/mail.module';
import { UserEvent } from './handlers/user.event';
import { UserEventService } from './services/user-event.service';

@Global()
@Module({
    imports: [forwardRef(() => MailModule)],
    providers: [UserEvent, UserEventService]
})
export class EventsModule {}

import { forwardRef, Global, Module } from '@nestjs/common';
import { MailModule } from 'src/@utils/mail/mail.module';
import { OrganizationStaffingModule } from 'src/components/app-user/user-roles/organization-staffing/organization-staffing.module';
import { OrganizationUnitModule } from 'src/components/app-user/user-roles/organization-unit/organization-unit.module';
import { OrganizationEvent } from './handlers/organization.event';
import { UserEvent } from './handlers/user.event';
import { OrganizationEventService } from './services/organization-event.service';
import { UserEventService } from './services/user-event.service';

@Global()
@Module({
    imports: [forwardRef(() => MailModule), OrganizationStaffingModule, OrganizationUnitModule],
    providers: [UserEvent, UserEventService, OrganizationEvent, OrganizationEventService]
})
export class EventsModule {}

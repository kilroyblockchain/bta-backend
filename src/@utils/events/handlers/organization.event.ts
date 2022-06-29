import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ORGANIZATION_CREATED } from '../constants/events.constants';
import { OrganizationEventService } from '../services/organization-event.service';

@Injectable()
export class OrganizationEvent {
    constructor(private readonly organizationEventService: OrganizationEventService) {}

    @OnEvent(ORGANIZATION_CREATED, { async: true })
    handleCreateOrganization(payload: { companyId: string }): void {
        this.organizationEventService.createOrganizationUnit(payload);
    }
}

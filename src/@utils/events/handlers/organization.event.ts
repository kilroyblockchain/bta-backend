import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Request } from 'express';
import { COMPANY_ADMIN_ORGANIZATION_CREATED, ORGANIZATION_CREATED } from '../constants/events.constants';
import { ICompanyAdminOrganizationPayload } from '../interfaces';
import { OrganizationEventService } from '../services/organization-event.service';

@Injectable()
export class OrganizationEvent {
    constructor(private readonly organizationEventService: OrganizationEventService) {}

    @OnEvent(ORGANIZATION_CREATED, { async: true })
    handleCreateOrganization(payload: { companyId: string }, req: Request): void {
        this.organizationEventService.createOrganizationUnit(payload, req);
    }

    @OnEvent(COMPANY_ADMIN_ORGANIZATION_CREATED, { async: true })
    handleCreateCompanyAdminOrganization(payload: ICompanyAdminOrganizationPayload): void {
        this.organizationEventService.createCompanyAdminOrganization(payload);
    }
}

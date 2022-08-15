import { HttpModule } from '@nestjs/axios';
import { forwardRef, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/@utils/mail/mail.module';
import { OrganizationStaffingModule } from 'src/components/app-user/user-roles/organization-staffing/organization-staffing.module';
import { OrganizationUnitModule } from 'src/components/app-user/user-roles/organization-unit/organization-unit.module';
import { UserModule } from 'src/components/app-user/user/user.module';
import { AiModelModule } from 'src/components/manage-project/ai-model/ai-model.module';
import { AiArtifactsModel } from 'src/components/manage-project/ai-model/schemas/ai-artifacts-model.schema';
import { AiModelSchema } from 'src/components/manage-project/ai-model/schemas/ai-mode.schema';
import { ProjectVersionModule } from 'src/components/manage-project/project-version/project-version.module';
import { OrganizationEvent } from './handlers/organization.event';
import { UserEvent } from './handlers/user.event';
import { VersionBcHashesEvent } from './handlers/version-bc-hashes.event';
import { OrganizationEventService } from './services/organization-event.service';
import { UserEventService } from './services/user-event.service';
import { VersionBcHashesEventService } from './services/version-bc-hashes-event.service';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'ai-model', schema: AiModelSchema },
            { name: 'ai-artifacts-model', schema: AiArtifactsModel }
        ]),
        forwardRef(() => MailModule),
        OrganizationStaffingModule,
        OrganizationUnitModule,
        UserModule,
        ProjectVersionModule,
        HttpModule,
        AiModelModule
    ],
    providers: [UserEvent, UserEventService, OrganizationEvent, OrganizationEventService, VersionBcHashesEvent, VersionBcHashesEventService]
})
export class EventsModule {}

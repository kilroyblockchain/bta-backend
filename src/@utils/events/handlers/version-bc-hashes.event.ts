import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Request } from 'express';
import { IProjectVersion } from 'src/components/manage-project/project-version/interfaces/project-version.interface';
import { VERSION_ALL_ORACLE_BC_HASHES } from '../constants/events.constants';
import { VersionBcHashesEventService } from '../services/version-bc-hashes-event.service';

@Injectable()
export class VersionBcHashesEvent {
    constructor(private readonly versionBcHashesEventService: VersionBcHashesEventService) {}

    @OnEvent(VERSION_ALL_ORACLE_BC_HASHES, { async: true })
    handleVersionAllBcHashes(payload: { version: IProjectVersion; req: Request }): void {
        this.versionBcHashesEventService.versionAllBcHashesEvent(payload.version, payload.req);
    }
}

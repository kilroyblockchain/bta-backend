import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { BC_CONNECTION_API } from 'src/@core/constants/bc-constants/bc-connection.api.constant';
import { UserService } from 'src/components/app-user/user/user.service';
import { BcConnectionService } from 'src/components/blockchain/bc-connection/bc-connection.service';
import { BcAuthenticationDto, BcConnectionDto } from 'src/components/blockchain/bc-connection/dto';
import { CreateBcProjectVersionDto } from './dto';
import { IProjectVersion } from './interfaces/project-version.interface';
import { ProjectVersionService } from './project-version.service';

@Injectable()
export class ProjectVersionBcService {
    constructor(private readonly bcConnectionService: BcConnectionService, private readonly userService: UserService, private readonly projectVersionService: ProjectVersionService) {}

    async createBcProjectVersion(req: Request, version: IProjectVersion): Promise<BcConnectionDto> {
        const userId = req['user']._id;
        const entryUser = await this.userService.getUserEmail(userId);

        const userData = await this.userService.getUserBcInfoDefaultChannel(version.createdBy);

        const projectVersionDto: CreateBcProjectVersionDto = {
            id: version._id,
            versionName: version.versionName,
            logFilePath: version.logFilePath,
            logFileVersion: version.logFileVersion,
            logFileBCHash: version.logFileBCHash,
            versionModel: version.versionModel,
            noteBookVersion: version.noteBookVersion,
            testDataSets: version.testDataSets,
            testDatasetBCHash: version.testDatasetBCHash,
            trainDataSets: version.trainDataSets,
            trainDatasetBCHash: version.trainDatasetBCHash,
            artifacts: version.artifacts,
            codeVersion: version.codeVersion,
            codeRepo: version.codeRepo,
            comment: version.comment,
            versionStatus: version.versionStatus,
            status: version.status,
            project: version.project,
            entryUser: entryUser['email']
        };

        const blockChainAuthDto: BcAuthenticationDto = {
            basicAuthorization: userData.company[0].staffingId[0]['bcNodeInfo'].authorizationToken,
            organizationName: userData.company[0].staffingId[0]['bcNodeInfo'].orgName,
            channelName: userData.company[0].staffingId[0]['channels'][0].channelName,
            bcKey: req.headers['bc-key'] as string,
            salt: userData.bcSalt,
            nodeUrl: userData.company[0].staffingId[0]['bcNodeInfo'].nodeUrl,
            bcConnectionApi: BC_CONNECTION_API.CREATE_PROJECT_VERSION_BC
        };

        return await this.bcConnectionService.invoke(projectVersionDto, blockChainAuthDto);
    }
}

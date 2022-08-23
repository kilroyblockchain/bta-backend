import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { MANAGE_PROJECT_CONSTANT } from 'src/@core/constants';
import { BC_CONNECTION_API } from 'src/@core/constants/bc-constants/bc-connection.api.constant';
import { MANAGE_PROJECT_BC_CONSTANT } from 'src/@core/constants/bc-constants/bc-manage-project.constant';
import { IUser } from 'src/components/app-user/user/interfaces/user.interface';
import { UserService } from 'src/components/app-user/user/user.service';
import { BcConnectionService } from 'src/components/blockchain/bc-connection/bc-connection.service';
import { BcAuthenticationDto, BcConnectionDto } from 'src/components/blockchain/bc-connection/dto';
import { ProjectService } from 'src/components/manage-project/project/project.service';
import { VersionStatus } from './enum/version-status.enum';
import { IBcProject, IBcProjectVersion } from './interfaces/bc-project-version.interface';
import { IProjectVersion } from './interfaces/project-version.interface';
import { ProjectVersionService } from './project-version.service';

@Injectable()
export class VersionBcService {
    constructor(private readonly bcConnectionService: BcConnectionService, private readonly projectService: ProjectService, private readonly userService: UserService, @Inject(forwardRef(() => ProjectVersionService)) private readonly projectVersionService: ProjectVersionService) {}
    async createBcProjectVersion(req: Request, version: IProjectVersion): Promise<BcConnectionDto> {
        const logger = new Logger(VersionBcService.name + '-createBcProjectVersion');
        try {
            const userId = req['user']._id;
            const entryUser = await this.userService.getUserEmail(userId);
            const project = await this.projectService.getProjectById(version.project, req);
            const projectInfo: IBcProject = {
                id: project._id,
                projectName: project.name
            };

            let query: { isCompanyChannel: boolean; isDefault: boolean };
            if (version.versionStatus == VersionStatus.DRAFT) {
                query = { isCompanyChannel: false, isDefault: false };
            } else {
                query = { isCompanyChannel: true, isDefault: false };
            }

            const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);
            const blockChainAuthDto = this.getBcBcAuthentication(req, userData, BC_CONNECTION_API.PROJECT_VERSION_BC);
            const projectVersionDto: IBcProjectVersion = {
                id: version._id,
                versionName: version.versionName,
                logFilePath: version.logFilePath,
                logFileBCHash: version.logFileBCHash,
                noteBookVersion: version.noteBookVersion,
                testDataSetsUrl: version.testDataSets,
                testDatasetBCHash: version.testDatasetBCHash,
                trainDataSetsUrl: version.trainDataSets,
                trainDatasetBCHash: version.trainDatasetBCHash,
                aiModelUrl: version.aiModel,
                aiModelBCHash: version.aiModelBcHash,
                codeVersion: version.codeVersion,
                codeRepo: version.codeRepo,
                comment: version.comment,
                versionStatus: version.versionStatus,
                status: version.status,
                project: projectInfo,
                entryUser: entryUser['email']
            };

            return await this.bcConnectionService.invoke(projectVersionDto, blockChainAuthDto);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
        }
    }

    async getProjectVersionDetails(versionId: string, req: Request): Promise<BcConnectionDto> {
        const logger = new Logger(VersionBcService.name + '-getProjectVersionDetails');
        try {
            const version = await this.projectVersionService.getVersionById(versionId);
            if (!version) {
                throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);
            }

            let query: { isCompanyChannel: boolean; isDefault: boolean };
            if (version.versionStatus == VersionStatus.DRAFT) {
                query = { isCompanyChannel: false, isDefault: false };
            } else {
                query = { isCompanyChannel: true, isDefault: false };
            }

            const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);
            const blockChainAuthDto = this.getBcBcAuthentication(req, userData, BC_CONNECTION_API.PROJECT_VERSION_BC);

            return await this.bcConnectionService.query(blockChainAuthDto, version._id);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
            throw new BadRequestException([MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_GET_PROJECT_VERSION_BC_DETAILS], err);
        }
    }

    async getProjectVersionBcHistory(versionId: string, req: Request): Promise<BcConnectionDto> {
        const logger = new Logger(VersionBcService.name + '-getProjectVersionBcHistory');
        try {
            const version = await this.projectVersionService.getVersionById(versionId);
            if (!version) {
                throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);
            }

            let query: { isCompanyChannel: boolean; isDefault: boolean };
            if (version.versionStatus == VersionStatus.DRAFT) {
                query = { isCompanyChannel: false, isDefault: false };
            } else {
                query = { isCompanyChannel: true, isDefault: false };
            }
            const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);
            const blockChainAuthDto = this.getBcBcAuthentication(req, userData, BC_CONNECTION_API.PROJECT_VERSION_BC_HISTORY);

            return await this.bcConnectionService.query(blockChainAuthDto, version._id);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
            throw new BadRequestException([MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_PROJECT_VERSION_BC_HISTORY], err);
        }
    }

    getBcBcAuthentication(req: Request, userData: IUser, bcConnectionApi: string): BcAuthenticationDto {
        const blockChainAuthDto: BcAuthenticationDto = {
            basicAuthorization: userData.company[0].staffingId[0]['bcNodeInfo'].authorizationToken,
            organizationName: userData.company[0].staffingId[0]['bcNodeInfo'].orgName,
            channelName: userData.company[0].staffingId[0]['channels'][0].channelName,
            bcKey: req.headers['bc-key'] as string,
            salt: userData.bcSalt,
            nodeUrl: userData.company[0].staffingId[0]['bcNodeInfo'].nodeUrl,
            bcConnectionApi
        };
        return blockChainAuthDto;
    }

    async channelTransferModelVersion(versionDto: IBcProjectVersion, req: Request): Promise<BcConnectionDto> {
        versionDto.versionStatus = VersionStatus.SUBMITTED;
        const query = { isCompanyChannel: true, isDefault: false };
        const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);
        const blockChainAuthDto = this.getBcBcAuthentication(req, userData, BC_CONNECTION_API.PROJECT_VERSION_BC);

        return await this.bcConnectionService.invoke(versionDto, blockChainAuthDto);
    }
}

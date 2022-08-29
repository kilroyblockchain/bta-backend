import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { MANAGE_PROJECT_CONSTANT } from 'src/@core/constants';
import { BC_CONNECTION_API } from 'src/@core/constants/bc-constants/bc-connection.api.constant';
import { MANAGE_PROJECT_BC_CONSTANT } from 'src/@core/constants/bc-constants/bc-manage-project.constant';
import { IUser } from 'src/components/app-user/user/interfaces/user.interface';
import { UserService } from 'src/components/app-user/user/user.service';
import { BcConnectionService } from 'src/components/blockchain/bc-connection/bc-connection.service';
import { BcAuthenticationDto } from 'src/components/blockchain/bc-connection/dto';
import { BcConnectionDto } from 'src/components/blockchain/bc-connection/dto/bc-connection.dto';
import { ProjectVersionService } from 'src/components/manage-project/project-version/project-version.service';
import { IBcProject, IProject } from './interfaces';
import { ProjectService } from './project.service';

@Injectable()
export class ProjectBcService {
    constructor(private readonly bcConnectionService: BcConnectionService, private readonly projectService: ProjectService, private readonly userService: UserService, private readonly versionService: ProjectVersionService) {}

    async createBcProject(req: Request, project: IProject): Promise<BcConnectionDto> {
        const logger = new Logger(ProjectBcService.name + '-createBcProject');

        try {
            const entryUser = await this.userService.getUserEmail(project.createdBy);
            const projectMembers = await this.userService.getUserEmail(project.members);

            const query = { isCompanyChannel: true, isDefault: false };
            const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);
            const modelVersion = await this.versionService.getVersionData(project.projectVersions);

            const blockChainAuthDto = this.getBcBcAuthentication(req, userData, BC_CONNECTION_API.PROJECT_BC);
            const projectDto: IBcProject = {
                id: project._id,
                name: project.name,
                detail: project.details,
                members: <string[]>projectMembers,
                domain: project.domain,
                status: project.status,
                modelVersions: modelVersion,
                entryUser: entryUser['email']
            };
            return await this.bcConnectionService.invoke(projectDto, blockChainAuthDto);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
        }
    }

    async getProjectBcDetails(projectId: string, req: Request): Promise<BcConnectionDto> {
        const logger = new Logger(ProjectBcService.name + '-getProjectBcDetails');
        try {
            const project = await this.projectService.getProjectById(projectId, req);
            if (!project) {
                throw new NotFoundException(MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND);
            }

            const query = { isCompanyChannel: true, isDefault: false };
            const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);
            const blockChainAuthDto = this.getBcBcAuthentication(req, userData, BC_CONNECTION_API.PROJECT_BC);

            return await this.bcConnectionService.query(blockChainAuthDto, project._id);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
            throw new BadRequestException([MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_GET_PROJECT_BC_DETAILS], err);
        }
    }

    async getProjectBcHistory(projectId: string, req: Request): Promise<BcConnectionDto> {
        const logger = new Logger(ProjectBcService.name + '-getProjectBcHistory');
        try {
            const project = await this.projectService.getProjectById(projectId, req);
            if (!project) {
                throw new NotFoundException(MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND);
            }

            const query = { isCompanyChannel: true, isDefault: false };
            const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);
            const blockChainAuthDto = this.getBcBcAuthentication(req, userData, BC_CONNECTION_API.GET_PROJECT_BC_HISTORY);

            return await this.bcConnectionService.query(blockChainAuthDto, project._id);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
            throw new BadRequestException([MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_PROJECT_BC_HISTORY], err);
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
}

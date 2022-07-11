import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { MANAGE_PROJECT_CONSTANT } from 'src/@core/constants';
import { BC_CONNECTION_API } from 'src/@core/constants/bc-constants/bc-connection.api.constant';
import { MANAGE_PROJECT_BC_CONSTANT } from 'src/@core/constants/bc-constants/bc-manage-project.constant';
import { UserService } from 'src/components/app-user/user/user.service';
import { BcConnectionService } from 'src/components/blockchain/bc-connection/bc-connection.service';
import { BcConnectionDto } from 'src/components/blockchain/bc-connection/dto/bc-connection.dto';
import { ProjectService } from './project.service';

@Injectable()
export class ProjectBcService {
    constructor(private readonly bcConnectionService: BcConnectionService, private readonly projectService: ProjectService, private readonly userService: UserService) {}

    async getProjectBcDetails(projectId: string, req: Request): Promise<BcConnectionDto> {
        const logger = new Logger(ProjectBcService.name + '-getProjectBcDetails');
        try {
            const project = await this.projectService.getProjectById(projectId, req);
            if (!project) {
                throw new NotFoundException(MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND);
            }

            const userData = await this.userService.getUserBcInfoDefaultChannel(project.createdBy);

            const blockChainAuthDto = {
                basicAuthorization: userData.company[0].staffingId[0]['bcNodeInfo'].authorizationToken,
                organizationName: userData.company[0].staffingId[0]['bcNodeInfo'].orgName,
                channelName: userData.company[0].staffingId[0]['channels'][0].channelName,
                bcKey: req.headers['bc-key'] as string,
                salt: userData.bcSalt,
                nodeUrl: userData.company[0].staffingId[0]['bcNodeInfo'].nodeUrl,
                bcConnectionApi: BC_CONNECTION_API.PROJECT_BC + `/${project._id}`
            };

            return await this.bcConnectionService.query(blockChainAuthDto);
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

            const userData = await this.userService.getUserBcInfoDefaultChannel(project.createdBy);

            const blockChainAuthDto = {
                basicAuthorization: userData.company[0].staffingId[0]['bcNodeInfo'].authorizationToken,
                organizationName: userData.company[0].staffingId[0]['bcNodeInfo'].orgName,
                channelName: userData.company[0].staffingId[0]['channels'][0].channelName,
                bcKey: req.headers['bc-key'] as string,
                salt: userData.bcSalt,
                nodeUrl: userData.company[0].staffingId[0]['bcNodeInfo'].nodeUrl,
                bcConnectionApi: BC_CONNECTION_API.GET_PROJECT_BC_HISTORY + `/${project._id}`
            };

            return await this.bcConnectionService.query(blockChainAuthDto);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
            throw new BadRequestException([MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_PROJECT_BC_HISTORY], err);
        }
    }
}

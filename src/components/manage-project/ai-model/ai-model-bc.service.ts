import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { MANAGE_PROJECT_CONSTANT } from 'src/@core/constants';
import { BC_CONNECTION_API } from 'src/@core/constants/bc-constants/bc-connection.api.constant';
import { MANAGE_PROJECT_BC_CONSTANT } from 'src/@core/constants/bc-constants/bc-manage-project.constant';
import { IUser } from 'src/components/app-user/user/interfaces/user.interface';
import { UserService } from 'src/components/app-user/user/user.service';
import { BcConnectionService } from 'src/components/blockchain/bc-connection/bc-connection.service';
import { BcAuthenticationDto } from 'src/components/blockchain/bc-connection/dto';
import { BcConnectionDto } from 'src/components/blockchain/bc-connection/dto';
import { ProjectVersionService } from 'src/components/manage-project/project-version/project-version.service';
import { VersionStatus } from '../project-version/enum/version-status.enum';
import { AiModelService } from './ai-model.service';
import { IBcArtifactModel, IGetBcArtifactModel } from './interfaces/ai-artifacts-bc-model.interface';
import { IAiArtifactsModel } from './interfaces/ai-artifacts-model.interface';
import { IBcExperiment, IGetBcExperiment } from './interfaces/ai-model-bc-experiment.interface';
import { IAiModel } from './interfaces/ai-model.interface';

@Injectable()
export class AIModelBcService {
    constructor(
        private readonly bcConnectionService: BcConnectionService,
        @Inject(forwardRef(() => ProjectVersionService)) private readonly versionService: ProjectVersionService,
        private readonly userService: UserService,
        @Inject(forwardRef(() => AiModelService)) private readonly aiModelService: AiModelService
    ) {}

    async createBcExperiment(req: Request, experiment: IAiModel): Promise<BcConnectionDto> {
        const logger = new Logger(AIModelBcService.name + '-createBcExperiment');

        try {
            const userId = req['user']._id;

            const entryUser = await this.userService.getUserEmail(userId);
            const version = await this.versionService.getVersionInfo(experiment.version);

            let query: { isCompanyChannel: boolean; isDefault: boolean };
            if (version.versionStatus == VersionStatus.DRAFT) {
                query = { isCompanyChannel: false, isDefault: false };
            } else {
                query = { isCompanyChannel: true, isDefault: false };
            }

            const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);
            const blockChainAuthDto = this.getBcAuthentication(req, userData, BC_CONNECTION_API.STORE_MODEL_EXPERIMENT_BC);

            const experimentDto: IBcExperiment = {
                experimentName: experiment.expNo,
                experimentBcHash: experiment.experimentBcHash,
                modelVersion: {
                    id: version._id,
                    versionName: version.versionName
                },
                project: {
                    id: version.project['_id'],
                    projectName: version.project['name']
                },
                entryUser: entryUser['email']
            };

            return await this.bcConnectionService.invoke(experimentDto, blockChainAuthDto);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
        }
    }

    async getExperimentBcDetails(experimentId: string, req: Request): Promise<BcConnectionDto> {
        const logger = new Logger(AIModelBcService.name + '-getExperimentBcDetails');

        try {
            const experiment = await this.aiModelService.getExperimentById(experimentId);
            if (!experiment) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND);

            let query: { isCompanyChannel: boolean; isDefault: boolean };
            if (experiment.version['versionStatus'] === VersionStatus.DRAFT) {
                query = { isCompanyChannel: false, isDefault: false };
            } else {
                query = { isCompanyChannel: true, isDefault: false };
            }
            const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);
            const blockChainAuthDto = this.getBcAuthentication(req, userData, BC_CONNECTION_API.GET_MODEL_BC_EXPERIMENT_DETAILS);

            const experimentDto: IGetBcExperiment = {
                experimentName: experiment.expNo,
                modelVersion: {
                    id: experiment.version['_id']
                },
                project: {
                    id: experiment.project
                }
            };

            return await this.bcConnectionService.invoke(experimentDto, blockChainAuthDto);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
            throw new BadRequestException([MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_MODEL_EXPERIMENT_BC_DETAILS], err);
        }
    }

    async getExperimentBcHistory(experimentId: string, req: Request): Promise<BcConnectionDto> {
        const logger = new Logger(AIModelBcService.name + '-getExperimentBcDetails');

        try {
            const experiment = await this.aiModelService.getExperimentById(experimentId);
            if (!experiment) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND);

            let query: { isCompanyChannel: boolean; isDefault: boolean };
            if (experiment.version['versionStatus'] === VersionStatus.DRAFT) {
                query = { isCompanyChannel: false, isDefault: false };
            } else {
                query = { isCompanyChannel: true, isDefault: false };
            }

            const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);
            const blockChainAuthDto = this.getBcAuthentication(req, userData, BC_CONNECTION_API.GET_MODEL_BC_EXPERIMENT_HISTORY);

            const experimentDto: IGetBcExperiment = {
                experimentName: experiment.expNo,
                modelVersion: {
                    id: experiment.version['_id']
                },
                project: {
                    id: experiment.project
                }
            };

            return await this.bcConnectionService.invoke(experimentDto, blockChainAuthDto);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
            throw new BadRequestException([MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_MODEL_EXPERIMENT_BC_HISTORY], err);
        }
    }

    getBcAuthentication(req: Request, userData: IUser, bcConnectionApi: string): BcAuthenticationDto {
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

    async createBcArtifactsModel(req: Request, artifactsModel: IAiArtifactsModel): Promise<BcConnectionDto> {
        const logger = new Logger(AIModelBcService.name + '-createBcArtifactsModel');

        try {
            const userId = req['user']._id;
            const entryUser = await this.userService.getUserEmail(userId);

            const version = await this.versionService.getVersionInfo(artifactsModel.version);

            let query: { isCompanyChannel: boolean; isDefault: boolean };
            if (version.versionStatus == VersionStatus.DRAFT) {
                query = { isCompanyChannel: false, isDefault: false };
            } else {
                query = { isCompanyChannel: true, isDefault: false };
            }

            const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);
            const blockChainAuthDto = this.getBcAuthentication(req, userData, BC_CONNECTION_API.STORE_ARTIFACT_MODEL_BC);

            const artifactModelDto: IBcArtifactModel = {
                modelArtifactName: artifactsModel.modelNo,
                modelArtifactBcHash: artifactsModel.modelBcHash,
                modelVersion: {
                    id: version._id,
                    versionName: version.versionName
                },
                project: {
                    id: version.project['_id'],
                    projectName: version.project['name']
                },
                entryUser: entryUser['email']
            };

            return await this.bcConnectionService.invoke(artifactModelDto, blockChainAuthDto);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
        }
    }

    async getArtifactModelBcDetails(modelId: string, req: Request): Promise<BcConnectionDto> {
        const logger = new Logger(AIModelBcService.name + '-getArtifactModelBcDetails');

        try {
            const artifactsModel = await this.aiModelService.getArtifactModel(modelId);
            if (!artifactsModel) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.ARTIFACT_MODEL_RECORD_NOT_FOUND);

            let query: { isCompanyChannel: boolean; isDefault: boolean };
            if (artifactsModel.version['versionStatus'] === VersionStatus.DRAFT) {
                query = { isCompanyChannel: false, isDefault: false };
            } else {
                query = { isCompanyChannel: true, isDefault: false };
            }
            const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);
            const blockChainAuthDto = this.getBcAuthentication(req, userData, BC_CONNECTION_API.GET_ARTIFACT_MODEL_BC_DETAILS);

            const artifactModelDto: IGetBcArtifactModel = {
                modelArtifactName: artifactsModel.modelNo,
                modelVersion: {
                    id: artifactsModel.version['_id']
                },
                project: {
                    id: artifactsModel.project
                }
            };

            return await this.bcConnectionService.invoke(artifactModelDto, blockChainAuthDto);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
            throw new BadRequestException([MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_ARTIFACT_MODEL_BC_DETAILS], err);
        }
    }

    async getArtifactModelBcHistory(modelId: string, req: Request): Promise<BcConnectionDto> {
        const logger = new Logger(AIModelBcService.name + '-getArtifactModelBcHistory');
        try {
            const artifactsModel = await this.aiModelService.getArtifactModel(modelId);
            if (!artifactsModel) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.ARTIFACT_MODEL_RECORD_NOT_FOUND);

            const query = { isCompanyChannel: false, isDefault: false };
            const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);
            const blockChainAuthDto = this.getBcAuthentication(req, userData, BC_CONNECTION_API.GET_ARTIFACT_MODEL_BC_HISTORY);

            const artifactModelDto: IGetBcArtifactModel = {
                modelArtifactName: artifactsModel.modelNo,
                modelVersion: {
                    id: artifactsModel.version['_id']
                },
                project: {
                    id: artifactsModel.project
                }
            };

            return await this.bcConnectionService.invoke(artifactModelDto, blockChainAuthDto);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
            throw new BadRequestException([MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_ARTIFACT_MODEL_BC_HISTORY], err);
        }
    }

    async channelTransferExperiment(experimentDto: IBcExperiment, req: Request): Promise<BcConnectionDto> {
        const query = { isCompanyChannel: true, isDefault: false };

        const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);
        const blockChainAuthDto = this.getBcAuthentication(req, userData, BC_CONNECTION_API.STORE_MODEL_EXPERIMENT_BC);

        return await this.bcConnectionService.invoke(experimentDto, blockChainAuthDto);
    }

    async channelTransferArtifactModel(artifactModelDto: IBcArtifactModel, req: Request): Promise<BcConnectionDto> {
        const query = { isCompanyChannel: true, isDefault: false };
        const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);
        const blockChainAuthDto = this.getBcAuthentication(req, userData, BC_CONNECTION_API.STORE_ARTIFACT_MODEL_BC);

        return await this.bcConnectionService.invoke(artifactModelDto, blockChainAuthDto);
    }
}

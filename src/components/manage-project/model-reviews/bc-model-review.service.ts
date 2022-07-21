import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { MANAGE_PROJECT_CONSTANT } from 'src/@core/constants';
import { BC_CONNECTION_API } from 'src/@core/constants/bc-constants/bc-connection.api.constant';
import { MANAGE_PROJECT_BC_CONSTANT } from 'src/@core/constants/bc-constants/bc-manage-project.constant';
import { IUser } from 'src/components/app-user/user/interfaces/user.interface';
import { UserService } from 'src/components/app-user/user/user.service';
import { BcConnectionService } from 'src/components/blockchain/bc-connection/bc-connection.service';
import { BcAuthenticationDto, BcConnectionDto } from 'src/components/blockchain/bc-connection/dto';
import { ProjectVersionService } from 'src/components/manage-project/project-version/project-version.service';
import { IBcModelReview } from './interfaces/bc-model-review.interface';
import { IModelReview } from './interfaces/model-review.interface';

@Injectable()
export class ModelReviewBcService {
    constructor(private readonly bcConnectionService: BcConnectionService, private readonly userService: UserService, private readonly modeVersionService: ProjectVersionService) {}

    async createBcVersionReview(req: Request, modelReview: IModelReview): Promise<BcConnectionDto> {
        const logger = new Logger(ModelReviewBcService.name + '-createBcVersionReview');
        try {
            const userId = req['user']._id;
            const entryUser = await this.userService.getUserEmail(userId);
            const version = await this.modeVersionService.getVersionById(modelReview.version);

            const userData = await this.userService.getUserBcInfoDefaultChannel(userId);
            const blockChainAuthDto = this.getBcAuthentication(req, userData, BC_CONNECTION_API.MODEL_VERSION_BC);
            const reviewModelDto: IBcModelReview = {
                id: version._id,
                reviewStatus: version.versionStatus,
                comment: modelReview.comment,
                ratings: String(modelReview.rating),
                entryUserDetail: {
                    entryUser: entryUser['email'],
                    organizationUnit: userData.company[0].staffingId[0]['organizationUnitId'].unitName,
                    staffing: userData.company[0].staffingId[0]['staffingName']
                },
                deployedUrl: modelReview.deployedModelURL,
                deploymentInstruction: modelReview.deployedModelInstruction,
                productionURL: modelReview.productionURL,
                reviewSupportingDocument: modelReview.documents
            };

            return await this.bcConnectionService.invoke(reviewModelDto, blockChainAuthDto);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
        }
    }

    async getModelReviewBcDetails(versionId: string, req: Request): Promise<BcConnectionDto> {
        const logger = new Logger(ModelReviewBcService.name + '-getModelReviewBcDetails');
        try {
            const userId = req['user']._id;

            const version = await this.modeVersionService.getVersionById(versionId);
            if (!version) {
                throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);
            }
            const userData = await this.userService.getUserBcInfoDefaultChannel(userId);
            const blockChainAuthDto = this.getBcAuthentication(req, userData, BC_CONNECTION_API.MODEL_VERSION_BC);

            return await this.bcConnectionService.query(blockChainAuthDto, version._id);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
            throw new BadRequestException([MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_GET_MODEL_REVIEW_BC_DETAILS], err);
        }
    }

    async getModelReviewBcHistory(versionId: string, req: Request): Promise<BcConnectionDto> {
        const logger = new Logger(ModelReviewBcService.name + '-getModelReviewBcHistory');
        try {
            const userId = req['user']._id;

            const version = await this.modeVersionService.getVersionById(versionId);
            if (!version) {
                throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);
            }
            const userData = await this.userService.getUserBcInfoDefaultChannel(userId);
            const blockChainAuthDto = this.getBcAuthentication(req, userData, BC_CONNECTION_API.MODEL_VERSION_BC_HISTORY);

            return await this.bcConnectionService.query(blockChainAuthDto, version._id);
        } catch (err) {
            logger.error(err);
            if (err.statusCode) {
                throw err;
            }
            throw new BadRequestException([MANAGE_PROJECT_BC_CONSTANT.UNABLE_TO_FETCH_MODEL_REVIEW_BC_HISTORY], err);
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
}

import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { BC_CONNECTION_API } from 'src/@core/constants/bc-constants/bc-connection.api.constant';
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
            const blockChainAuthDto = this.getBcBcAuthentication(req, userData, BC_CONNECTION_API.MODEL_VERSION_BC);
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

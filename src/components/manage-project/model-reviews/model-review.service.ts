import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { IModelReview } from './interfaces/model-review.interface';
import { Request } from 'express';
import { AddModelReviewDto } from './dto';
import { ProjectVersionService } from '../project-version/project-version.service';
import { MANAGE_PROJECT_CONSTANT } from 'src/@core/constants';
import { UserService } from 'src/components/app-user/user/user.service';
import { ModelReviewBcService } from './bc-model-review.service';
import { VersionStatus } from '../project-version/enum/version-status.enum';

@Injectable()
export class ModelReviewService {
    constructor(@InjectModel('model-review') private readonly reviewModel: PaginateModel<IModelReview>, private readonly versionService: ProjectVersionService, private readonly userService: UserService, private readonly modelReviewBcService: ModelReviewBcService) {}

    async addModelReview(req: Request, versionId: string, files: Array<Express.Multer.File>, newReview: AddModelReviewDto): Promise<IModelReview> {
        const logger = new Logger(ModelReviewService.name + '-createBcExperiment');
        try {
            const version = await this.versionService.getVersionById(versionId);
            if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

            const user = await this.userService.findUserProfile(req);

            const staffing = user.company.staffingId.map((m) => m['staffingName']);

            const review = new this.reviewModel(newReview);
            files.forEach((file) => {
                const documents = {
                    docURL: `model-reviews/${file.filename}`,
                    docName: file.originalname
                };
                review.documents.push(documents);
            });
            review.createdBy = req['user']._id;
            review.version = version._id;
            review.rating = Number(newReview.rating);
            version.versionStatus = newReview.status;

            if (newReview.status === VersionStatus.DEPLOYED || newReview.status === VersionStatus.QA_STATUS) {
                version.isQAStatus = true;
            } else {
                version.isQAStatus = false;
            }
            review.staffing = staffing.join();

            if (newReview.status === VersionStatus.REVIEW) {
                version.reviewedDate = new Date();
            }
            if (newReview.status === VersionStatus.PRODUCTION) {
                version.productionDate = new Date();
            }
            await version.save();
            const reviewModel = await review.save();

            await this.modelReviewBcService.createBcVersionReview(req, reviewModel);
            return reviewModel;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getModelReviews(req: Request, versionId: string): Promise<PaginateResult<IModelReview>> {
        const logger = new Logger(ModelReviewService.name + '-getModelReviews');
        try {
            const version = await this.versionService.getVersionById(versionId);
            if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

            const { page = 1, limit = 10 } = req.query;
            const options = {
                populate: [{ path: 'createdBy', select: 'firstName lastName' }],
                lean: true,
                limit: Number(limit),
                page: Number(page),
                sort: { createdAt: -1 }
            };
            return await this.reviewModel.paginate({ version: versionId }, options);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}

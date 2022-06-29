import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IModelReview } from './interfaces/model-review.interface';
import { Request } from 'express';
import { AddModelReviewDto } from './dto';
import { ProjectVersionService } from '../project-version/project-version.service';
import { MANAGE_PROJECT_CONSTANT } from 'src/@core/constants';
import { UserService } from 'src/components/app-user/user/user.service';

@Injectable()
export class ModelReviewService {
    constructor(@InjectModel('model-review') private readonly modelReviewModel: Model<IModelReview>, private readonly versionService: ProjectVersionService, private readonly userService: UserService) {}

    async addModelReview(req: Request, versionId: string, files: Array<Express.Multer.File>, newReview: AddModelReviewDto): Promise<IModelReview> {
        const version = await this.versionService.getVersionById(versionId);
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

        const user = await this.userService.findUserProfile(req);

        const staffing = user.company.staffingId.map((m) => m['staffingName']);

        const review = new this.modelReviewModel(newReview);
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
        review.staffing = staffing.join();

        await version.save();
        return await review.save();
    }
}

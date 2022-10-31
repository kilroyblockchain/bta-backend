import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MANAGE_PROJECT_CONSTANT, VERSION_GET_BC_HASH_ACTIONS } from 'src/@core/constants';
import { IProjectVersion } from './interfaces/project-version.interface';
import { AddReviewModelDto, AddVersionDto } from './dto';
import { Request } from 'express';
import { ProjectService } from 'src/components/manage-project/project/project.service';
import { VersionBcService } from './project-version-bc.service';
import { AiModelService } from 'src/components/manage-project/ai-model/ai-model.service';
import { VersionStatus } from './enum/version-status.enum';
import { ProjectBcService } from '../project/project-bc.service';
import { UserService } from 'src/components/app-user/user/user.service';
import { ModelReviewBcService } from '../model-reviews/bc-model-review.service';
import { REVIEW_MODEL_ALL_ORACLE_BC_HASHES } from 'src/@utils/events/constants/events.constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AIModelBcService } from 'src/components/manage-project/ai-model/ai-model-bc.service';

@Injectable()
export class ProjectVersionService {
    constructor(
        @InjectModel('project-version') private readonly versionModel: Model<IProjectVersion>,
        private readonly projectService: ProjectService,
        @Inject(forwardRef(() => VersionBcService)) private readonly versionBcService: VersionBcService,
        @Inject(forwardRef(() => AiModelService)) private readonly aiModelService: AiModelService,
        @Inject(forwardRef(() => ProjectBcService)) private readonly projectBcService: ProjectBcService,
        private readonly userService: UserService,
        private readonly modelReviewBcService: ModelReviewBcService,
        private eventEmitter: EventEmitter2,
        private readonly aiModelBcService: AIModelBcService
    ) {}

    async addNewVersion(req: Request, projectId: string, newVersionDto: AddVersionDto): Promise<IProjectVersion> {
        const user = req['user']._id;

        const project = await this.projectService.getProjectById(projectId, req);
        if (!project) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND);

        const isVersionUnique = await this.isVersionUnique(newVersionDto.versionName, project._id);
        if (!isVersionUnique) throw new ConflictException(MANAGE_PROJECT_CONSTANT.PROJECT_VERSION_CONFLICT);

        const version = new this.versionModel(newVersionDto);

        version.createdBy = user;
        version.project = project._id;

        project.projectVersions.push(version._id);

        await project.save();
        const newVersion = await version.save();
        await this.aiModelService.getAllOracleDataBcHash(req, newVersion._id, VERSION_GET_BC_HASH_ACTIONS.CREATE);
        return newVersion;
    }

    async isVersionUnique(name: string, projectId: string): Promise<boolean> {
        const version = await this.versionModel.findOne({ versionName: { $regex: name, $options: 'i' }, project: projectId });
        if (version) {
            return false;
        }
        return true;
    }

    async getVersionById(id: string): Promise<IProjectVersion> {
        return await this.versionModel.findOne({ _id: id });
    }

    async updateVersion(id: string, updateVersionDto: AddVersionDto, req: Request): Promise<IProjectVersion> {
        const version = await this.getVersionById(id);
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

        const isVersionUnique = await this.isVersionUnique(updateVersionDto.versionName, version.project);
        if (!isVersionUnique && version.versionName !== updateVersionDto.versionName) {
            throw new ConflictException(MANAGE_PROJECT_CONSTANT.PROJECT_VERSION_CONFLICT);
        }

        const updatedVersion = await this.versionModel.findOneAndUpdate({ _id: version._id }, updateVersionDto, { new: true });

        if (version.versionName !== updateVersionDto.versionName) {
            await this.aiModelService.getAllOracleDataBcHash(req, updatedVersion._id, VERSION_GET_BC_HASH_ACTIONS.UPDATE);
        } else {
            await this.versionBcService.createBcProjectVersion(req, updatedVersion);
        }

        return updatedVersion;
    }

    async getVersionInfo(id: string): Promise<IProjectVersion> {
        const version = await this.getVersionById(id);
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

        const versionInfo = await version.populate([
            { path: 'project', select: 'name domain details _id' },
            { path: 'createdBy', select: 'firstName lastName email _id' }
        ]);

        return versionInfo;
    }

    async deleteVersion(id: string): Promise<IProjectVersion> {
        const version = await this.versionModel.findOneAndUpdate({ _id: id }, { status: false }, { new: true });
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

        return version;
    }

    async enableVersion(id: string): Promise<IProjectVersion> {
        const version = await this.versionModel.findOneAndUpdate({ _id: id }, { status: true }, { new: true });
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

        return version;
    }

    async addReviewModel(req: Request, projectId: string, newVersion: AddReviewModelDto): Promise<IProjectVersion> {
        const user = req['user']._id;

        const project = await this.projectService.getProjectById(projectId, req);
        if (!project) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND);

        const version = new this.versionModel(newVersion);
        version.createdBy = user;
        version.project = project._id;
        version.versionStatus = VersionStatus.MLOPS_REVIEW;
        const reviewModel = await version.save();

        this.eventEmitter.emit(REVIEW_MODEL_ALL_ORACLE_BC_HASHES, {
            reviewModel,
            req
        });

        return reviewModel;
    }

    async submitModelVersion(req: Request, versionId: string): Promise<IProjectVersion> {
        const version = await this.getVersionById(versionId);
        const userId = req['user']._id;

        if (!version) {
            throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);
        }
        if (version.createdBy.toString() !== userId.toString()) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_SUBMIT_MODEL_VERSION);
        }

        version.versionStatus = VersionStatus.PENDING;
        version.submittedDate = new Date();
        const versionBcDetails = await this.versionBcService.getProjectVersionDetails(version._id, req);

        const project = await this.projectService.getProjectById(version.project, req);
        if (!project) {
            throw new NotFoundException(MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND);
        }

        await this.versionBcService.channelTransferModelVersion(versionBcDetails.data, req);

        const allExperimentIds = await this.aiModelService.getAllExperimentIds(versionBcDetails.data.id);
        for (const experimentId of allExperimentIds) {
            const experimentBcDetails = await this.aiModelBcService.getExperimentBcDetails(experimentId._id, req);

            await this.aiModelBcService.channelTransferExperiment(experimentBcDetails.data.data, req);
        }

        const allArtifactModelIds = await this.aiModelService.getAllArtifactModelIds(versionBcDetails.data.id);
        for (const artifactModelId of allArtifactModelIds) {
            const artifactModelBcDetails = await this.aiModelBcService.getArtifactModelBcDetails(artifactModelId._id, req);
            await this.aiModelBcService.channelTransferArtifactModel(artifactModelBcDetails.data.data, req);
        }

        const updatedVersion = await version.save();
        await this.modelReviewBcService.createBcPendingVersion(req, updatedVersion);
        await this.projectBcService.createBcProject(req, project);

        return updatedVersion;
    }

    async getVersionData(versionIds: string[]): Promise<{ id: string; versionName: string }[]> {
        const versionData: { id: string; versionName: string }[] = [];
        for (const id of versionIds) {
            const version = await this.versionModel.findOne({ _id: id, versionStatus: { $ne: VersionStatus.DRAFT } }).select('_id versionName');
            if (version) {
                const versionInfo = {
                    id: version._id,
                    versionName: version.versionName
                };
                versionData.push(versionInfo);
            }
        }
        return versionData;
    }

    async getDefaultBucketUrl(req: Request, projectId: string): Promise<string> {
        const project = await this.projectService.getProjectById(projectId, req);

        const query = { isCompanyChannel: false, isDefault: false };
        const userData = await this.userService.getUserBcInfoAndChannelDetails(req, query);

        const bucketUrl = userData.company[0].staffingId[0]['bucketUrl'];
        const defaultBucketUrl = bucketUrl + `/${project.name}`;

        return defaultBucketUrl;
    }
}

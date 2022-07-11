import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MANAGE_PROJECT_CONSTANT } from 'src/@core/constants';
import { ProjectService } from '../project/project.service';
import { IProjectVersion } from './interfaces/project-version.interface';
import { AddReviewModelDto, AddVersionDto } from './dto';
import { Request } from 'express';
import { VersionBcService } from './project-version-bc.service';

@Injectable()
export class ProjectVersionService {
    constructor(@InjectModel('project-version') private readonly versionModel: Model<IProjectVersion>, private readonly projectService: ProjectService, @Inject(forwardRef(() => VersionBcService)) private readonly versionBcService: VersionBcService) {}

    async addNewVersion(req: Request, projectId: string, newVersion: AddVersionDto): Promise<IProjectVersion> {
        const user = req['user']._id;

        const project = await this.projectService.getProjectById(projectId, req);
        if (!project) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND);

        const isVersionUnique = await this.isVersionUnique(newVersion.versionName, project._id);
        if (!isVersionUnique) throw new ConflictException(MANAGE_PROJECT_CONSTANT.PROJECT_VERSION_CONFLICT);

        const version = new this.versionModel(newVersion);
        version.createdBy = user;
        version.project = project._id;

        project.projectVersions.push(version._id);

        await project.save();
        await this.versionBcService.createBcProjectVersion(req, version);
        return await version.save();
    }

    async isVersionUnique(name: string, projectId: string): Promise<boolean> {
        const version = await this.versionModel.findOne({ versionName: { $regex: name, $options: 'i' }, projectId });
        if (version) {
            return false;
        }
        return true;
    }

    async getVersionById(id: string): Promise<IProjectVersion> {
        return await this.versionModel.findOne({ _id: id });
    }

    async updateVersion(id: string, projectId: string, updateVersion: AddVersionDto): Promise<IProjectVersion> {
        const version = await this.getVersionById(id);
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

        const isVersionUnique = await this.isVersionUnique(updateVersion.versionName, projectId);
        if (!isVersionUnique && version.versionName !== updateVersion.versionName) {
            throw new ConflictException(MANAGE_PROJECT_CONSTANT.PROJECT_VERSION_CONFLICT);
        }

        return await this.versionModel.findOneAndUpdate({ _id: version._id }, updateVersion, { new: true });
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

        return await version.save();
    }
}

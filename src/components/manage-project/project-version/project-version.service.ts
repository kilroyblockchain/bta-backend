import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MANAGE_PROJECT_CONSTANT } from 'src/@core/constants';
import { ProjectService } from '../project/project.service';
import { IProjectVersion } from './interfaces/project-version.interface';
import { AddVersionDto } from './dto';
import { Request } from 'express';

@Injectable()
export class ProjectVersionService {
    constructor(@InjectModel('project-version') private readonly versionModel: Model<IProjectVersion>, private readonly projectService: ProjectService) {}

    async addNewVersion(req: Request, projectId: string, newVersion: AddVersionDto): Promise<IProjectVersion> {
        const user = req['user']._id;
        const isVersionUnique = await this.isVersionUnique(newVersion.versionName);
        if (!isVersionUnique) throw new ConflictException(MANAGE_PROJECT_CONSTANT.PROJECT_VERSION_CONFLICT);

        const project = await this.projectService.getProjectById(projectId, req);
        if (!project) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND);

        const version = new this.versionModel(newVersion);
        version.createdBy = user;
        version.projectId = project._id;

        const addVersion = await this.projectService.addVersion(project._id, version._id);
        if (!addVersion) throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_ADD_VERSION);

        return await version.save();
    }

    async isVersionUnique(name: string): Promise<boolean> {
        const version = await this.versionModel.findOne({ versionName: { $regex: name, $options: 'i' } });
        if (version) {
            return false;
        }
        return true;
    }
}

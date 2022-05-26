import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { USER_CONSTANT } from 'src/@core/constants/api-error-constants';
import { PROJECT_CONSTANT } from 'src/@core/constants/api-error-constants/project.constant';
import { getSearchFilterWithRegexAll } from 'src/@core/utils/query-filter.utils';
import { IUser } from '../flo-user/user/interfaces/user.interface';
import { ProjectAddDto } from './dto/project-add.dto';
import { ProjectStatusEnum } from './enum/project-status.enum';
import { IProject } from './interfaces/project.interface';

@Injectable()
export class ProjectService {
    constructor(@InjectModel('Project') private readonly projectModel: PaginateModel<IProject>, @InjectModel('Project') private readonly ProjectModel: Model<IProject>, @InjectModel('User') private readonly UserModel: Model<IUser>) {}

    async createProject(projectAddDto: ProjectAddDto): Promise<void> {
        console.log(projectAddDto);
        const logger = new Logger('CreateProject');
        const projectDataDb = await this.ProjectModel.findOne({ name: projectAddDto.name, version: projectAddDto.version });
        if (projectDataDb) {
            logger.error(PROJECT_CONSTANT.PROJECT_ALREADY_EXIST + ': ' + projectAddDto.name);
            throw new BadRequestException([PROJECT_CONSTANT.PROJECT_ALREADY_EXIST, 'Name: ' + projectAddDto.name, 'Version: ' + projectAddDto.version]);
        }
        for (const userId of projectAddDto.users) {
            const user = await this.UserModel.findById(userId).select('_id');
            if (!user) {
                logger.error(USER_CONSTANT.USER_NOT_FOUND + ': ' + userId);
                throw new BadRequestException([USER_CONSTANT.USER_NOT_FOUND, userId]);
            }
        }
        const project = new this.ProjectModel(projectAddDto);
        project.members = projectAddDto.users;
        project.projectStatus = ProjectStatusEnum.PENDING;
        console.log(project);
        await project.save();
    }

    async getAllProject(req: Request): Promise<PaginateResult<IProject>> {
        const { page, limit, search, searchValue } = req.query;
        const query = { status: true };
        const searchQuery = search && search === 'true' && searchValue ? getSearchFilterWithRegexAll(searchValue.toString(), ['name', 'domain', 'version', 'projectStatus']) : {};
        const options = {
            populate: { path: 'members', select: 'firstName lastName email -_id', model: this.UserModel },
            sort: { updatedAt: -1 },
            page: Number(page),
            limit: Number(limit)
        };
        return await this.projectModel.paginate({ ...query, ...searchQuery }, options);
    }
}

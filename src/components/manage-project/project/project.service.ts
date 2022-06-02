import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, PaginateModel } from 'mongoose';
import { PROJECT_CONSTANT, USER_CONSTANT } from 'src/@core/constants/api-error-constants';
import { IUser } from 'src/components/flo-user/user/interfaces/user.interface';
import { CreateProjectDto } from './dto';
import { IProject } from './interfaces/project.interface';

@Injectable()
export class ProjectService {
    constructor(@InjectModel('Project') private readonly projectModel: PaginateModel<IProject>, @InjectModel('User') private readonly userModel: Model<IUser>) {}

    async createNewProject(newProject: CreateProjectDto, req: Request): Promise<IProject> {
        const user = req['user']._id;
        const isProjectUnique = await this.isProjectUnique(newProject.name);
        if (!isProjectUnique) {
            throw new ConflictException(PROJECT_CONSTANT.PROJECT_NAME_CONFLICT);
        }
        for (const userId of newProject.members) {
            const user = await this.userModel.findById(userId).select('_id');
            if (!user) {
                throw new NotFoundException(USER_CONSTANT.USER_NOT_FOUND);
            }
        }
        const project = new this.projectModel(newProject);
        project.members = newProject.members;
        project.createdBy = user;
        return await project.save();
    }
    async isProjectUnique(name: string): Promise<boolean> {
        const project = await this.projectModel.findOne({ name: { $regex: name, $options: 'i' } });
        if (project) {
            return false;
        }
        return true;
    }
}

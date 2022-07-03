import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { PROJECT_USER } from 'src/@core/constants';
import { MANAGE_PROJECT_CONSTANT, USER_CONSTANT } from 'src/@core/constants/api-error-constants';
import { getCompanyId } from 'src/@core/utils/common.utils';
import { getSearchFilterWithRegexAll } from 'src/@core/utils/query-filter.utils';
import { OrganizationUnitService } from 'src/components/app-user/user-roles/organization-unit/organization-unit.service';
import { IUser } from 'src/components/app-user/user/interfaces/user.interface';
import { UserService } from 'src/components/app-user/user/user.service';
import { CreateProjectDto } from './dto';
import { IProject } from './interfaces/project.interface';

@Injectable()
export class ProjectService {
    constructor(@InjectModel('Project') private readonly projectModel: PaginateModel<IProject>, @InjectModel('User') private readonly userModel: Model<IUser>, private readonly userService: UserService, private readonly orgUnitService: OrganizationUnitService) {}

    async createNewProject(newProject: CreateProjectDto, req: Request): Promise<IProject> {
        const user = req['user']._id;
        const companyId = getCompanyId(req);

        const isProjectUnique = await this.isProjectUnique(newProject.name, companyId);
        if (!isProjectUnique) {
            throw new ConflictException(MANAGE_PROJECT_CONSTANT.PROJECT_NAME_CONFLICT);
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
        project.companyId = companyId;
        return await project.save();
    }

    async isProjectUnique(name: string, companyId: string): Promise<boolean> {
        const project = await this.projectModel.findOne({ name: { $regex: name, $options: 'i' }, companyId });
        if (project) {
            return false;
        }
        return true;
    }

    async getAllProject(req: Request): Promise<PaginateResult<IProject>> {
        const companyId = getCompanyId(req);
        const { page = 1, limit = 10, status = true, search, searchValue } = req.query;
        const searchQuery = search && search === 'true' && searchValue ? getSearchFilterWithRegexAll(searchValue.toString(), ['name', 'details', 'domain', 'purpose']) : {};
        const options = {
            populate: [
                { path: 'members', select: 'firstName lastName email address phone' },
                { path: 'createdBy', select: 'firstName lastName email' },
                {
                    path: 'projectVersions',
                    populate: {
                        path: 'createdBy',
                        select: 'firstName lastName'
                    }
                }
            ],
            lean: true,
            limit: Number(limit),
            page: Number(page),
            sort: { updatedAt: -1 }
        };
        return await this.projectModel.paginate({ status, ...searchQuery, companyId }, options);
    }

    async getProjectById(id: string, req: Request): Promise<IProject> {
        const companyId = getCompanyId(req);
        const project = await this.projectModel.findOne({ _id: id, companyId });
        if (project) {
            return project;
        }
        throw new NotFoundException(MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND);
    }

    async updateProject(id: string, updateProject: CreateProjectDto, req: Request): Promise<IProject> {
        const project = await this.getProjectById(id, req);
        const companyId = getCompanyId(req);

        if (!project) throw new NotFoundException([MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND]);
        const isProjectUnique = await this.isProjectUnique(updateProject.name, companyId);
        if (!isProjectUnique && project.name !== updateProject.name) {
            throw new ConflictException(MANAGE_PROJECT_CONSTANT.PROJECT_NAME_CONFLICT);
        }

        return await this.projectModel.findOneAndUpdate({ _id: project._id }, updateProject, { new: true });
    }

    async deleteProject(id: string, req: Request): Promise<IProject> {
        const companyId = getCompanyId(req);
        return await this.projectModel.findOneAndUpdate({ _id: id, companyId }, { status: false }, { new: true });
    }

    async enableProject(id: string, req: Request): Promise<IProject> {
        const companyId = getCompanyId(req);
        return await this.projectModel.findOneAndUpdate({ _id: id, companyId }, { status: true }, { new: true });
    }

    async canAddProject(req: Request): Promise<boolean> {
        const currentCompanyUser = await this.userService.findAllUserOfOrganization(req);

        const userStaffing = [];
        currentCompanyUser.docs.map((user) => user.company.map((company) => company.staffingId.map((staffing) => userStaffing.push(staffing['staffingName']))));

        const isAIEngineer = !!userStaffing.find((staffingName) => staffingName.toLowerCase().includes(PROJECT_USER.AI_ENGINEER.toLowerCase()));
        const isMLOpsEngineer = !!userStaffing.find((staffingName) => staffingName.toLowerCase().includes(PROJECT_USER.MLOps_ENGINEER.toLowerCase()));
        const isStakeholder = !!userStaffing.find((staffingName) => staffingName.toLowerCase().includes(PROJECT_USER.STAKEHOLDER.toLowerCase()));

        if (isAIEngineer && isMLOpsEngineer && isStakeholder) return true;
        return false;
    }
}

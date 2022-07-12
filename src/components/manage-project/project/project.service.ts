import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { PROJECT_USER } from 'src/@core/constants';
import { MANAGE_PROJECT_CONSTANT, USER_CONSTANT } from 'src/@core/constants/api-error-constants';
import { BC_CONNECTION_API } from 'src/@core/constants/bc-constants/bc-connection.api.constant';
import { getCompanyId } from 'src/@core/utils/common.utils';
import { getSearchFilterWithRegexAll } from 'src/@core/utils/query-filter.utils';
import { IUser } from 'src/components/app-user/user/interfaces/user.interface';
import { UserService } from 'src/components/app-user/user/user.service';
import { BcConnectionService } from 'src/components/blockchain/bc-connection/bc-connection.service';
import { BcAuthenticationDto } from 'src/components/blockchain/bc-connection/dto/bc-common-authenticate.dto';
import { AddProjectPurposeDto, CreateProjectDto } from './dto';
import { IProject } from './interfaces/project.interface';

@Injectable()
export class ProjectService {
    constructor(@InjectModel('Project') private readonly projectModel: PaginateModel<IProject>, @InjectModel('User') private readonly userModel: Model<IUser>, private readonly userService: UserService, private readonly bcConnectionService: BcConnectionService) {}

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

        const projectMembers = await this.userService.getUserEmail(newProject.members);
        const entryUser = await this.userService.getUserEmail(user);

        const userData = await this.userService.getUserBcInfoDefaultChannel(project.createdBy);
        const blockChainAuthDto: BcAuthenticationDto = {
            basicAuthorization: userData.company[0].staffingId[0]['bcNodeInfo'].authorizationToken,
            organizationName: userData.company[0].staffingId[0]['bcNodeInfo'].orgName,
            channelName: userData.company[0].staffingId[0]['channels'][0].channelName,
            bcKey: req.headers['bc-key'] as string,
            salt: userData.bcSalt,
            nodeUrl: userData.company[0].staffingId[0]['bcNodeInfo'].nodeUrl,
            bcConnectionApi: BC_CONNECTION_API.PROJECT_BC
        };

        const projectDto = {
            id: project._id,
            name: project.name,
            detail: project.details,
            members: projectMembers,
            domain: project.domain,
            entryUser: entryUser['email']
        };

        await this.bcConnectionService.invoke(projectDto, blockChainAuthDto);
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
        const userId = req['user']._id;

        const project = await this.getProjectById(id, req);
        const companyId = getCompanyId(req);

        if (!project) throw new NotFoundException([MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND]);
        const isProjectUnique = await this.isProjectUnique(updateProject.name, companyId);
        if (!isProjectUnique && project.name !== updateProject.name) {
            throw new ConflictException(MANAGE_PROJECT_CONSTANT.PROJECT_NAME_CONFLICT);
        }

        const updatedProject = await this.projectModel.findOneAndUpdate({ _id: project._id }, updateProject, { new: true });
        const projectMembers = await this.userService.getUserEmail(updateProject.members);
        const entryUser = await this.userService.getUserEmail(userId);

        const userData = await this.userService.getUserBcInfoDefaultChannel(updatedProject.createdBy);
        const blockChainAuthDto = {
            basicAuthorization: userData.company[0].staffingId[0]['bcNodeInfo'].authorizationToken,
            organizationName: userData.company[0].staffingId[0]['bcNodeInfo'].orgName,
            channelName: userData.company[0].staffingId[0]['channels'][0].channelName,
            bcKey: req.headers['bc-key'] as string,
            salt: userData.bcSalt,
            nodeUrl: userData.company[0].staffingId[0]['bcNodeInfo'].nodeUrl,
            bcConnectionApi: BC_CONNECTION_API.PROJECT_BC
        };

        const updatedProjectDto = {
            id: updatedProject._id,
            name: updatedProject.name,
            detail: updatedProject.details,
            members: projectMembers,
            domain: updatedProject.domain,
            entryUser: entryUser['email']
        };

        await this.bcConnectionService.invoke(updatedProjectDto, blockChainAuthDto);

        updatedProject.updatedBy = userId;
        return await updatedProject.save();
    }

    async deleteProject(id: string, req: Request): Promise<IProject> {
        const companyId = getCompanyId(req);
        return await this.projectModel.findOneAndUpdate({ _id: id, companyId }, { status: false }, { new: true });
    }

    async enableProject(id: string, req: Request): Promise<IProject> {
        const companyId = getCompanyId(req);
        return await this.projectModel.findOneAndUpdate({ _id: id, companyId }, { status: true }, { new: true });
    }

    async addProjectPurpose(id: string, req: Request, file: Express.Multer.File, purpose: AddProjectPurposeDto): Promise<IProject> {
        const project = await this.getProjectById(id, req);
        if (!project) throw new NotFoundException([MANAGE_PROJECT_CONSTANT.PROJECT_RECORDS_NOT_FOUND]);

        if (file) {
            project.purpose.docName = file.originalname;
            project.purpose.docURL = `project-purposeDoc/${file.filename}`;
        }

        if (purpose.purposeDoc === '') {
            project.purpose.docName = '';
            project.purpose.docURL = '';
        }

        project.purpose.text = purpose.purpose ? purpose.purpose : project.purpose.text;

        return await project.save();
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

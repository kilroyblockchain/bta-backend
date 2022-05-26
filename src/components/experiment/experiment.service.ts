import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { USER_CONSTANT } from 'src/@core/constants/api-error-constants';
import { EXPERIMENT_CONSTANT } from 'src/@core/constants/api-error-constants/experiment.constant';
import { PROJECT_CONSTANT } from 'src/@core/constants/api-error-constants/project.constant';
import { buildPaginateResult, getPaginateDocumentStage, sortDocumentsBy } from 'src/@core/utils/aggregate-paginate.utils';
import { getSearchFilterWithRegexAll } from 'src/@core/utils/query-filter.utils';
import { IUser } from '../flo-user/user/interfaces/user.interface';
import { IProject } from '../project/interfaces/project.interface';
import { ExperimentAddDto } from './dto/experiment-add.dto';
import { IExperiment, IExperimentResponse } from './interfaces/experiment.interface';

@Injectable()
export class ExperimentService {
    constructor(
        @InjectModel('Experiment') private readonly experimentModel: PaginateModel<IExperimentResponse>,
        @InjectModel('Experiment') private readonly ExperimentModel: Model<IExperiment>,
        @InjectModel('User') private readonly UserModel: Model<IUser>,
        @InjectModel('Project') private readonly ProjectModel: Model<IProject>
    ) {}

    async createExperiment(experimentAddDto: ExperimentAddDto): Promise<void> {
        const logger = new Logger('CreateExperiment');
        const experimentDataDb = await this.ExperimentModel.findOne({ project: experimentAddDto.projectId, experimentVersion: experimentAddDto.experimentVersion });
        if (experimentDataDb) {
            logger.error(EXPERIMENT_CONSTANT.EXPERIMENT_ALREADY_EXIST + ': Project - ' + experimentAddDto.projectId + ', Experiment Version: ' + experimentAddDto.experimentVersion);
            throw new BadRequestException([EXPERIMENT_CONSTANT.EXPERIMENT_ALREADY_EXIST + ': Project - ' + experimentAddDto.projectId + ', Experiment Version: ' + experimentAddDto.experimentVersion]);
        }
        // Check User
        const user = await this.UserModel.findById(experimentAddDto.userId);
        if (!user) {
            logger.error(USER_CONSTANT.USER_NOT_FOUND);
            throw new BadRequestException([USER_CONSTANT.USER_NOT_FOUND]);
        }

        // Check Project
        const project = await this.ProjectModel.findById(experimentAddDto.projectId);
        if (!project) {
            logger.error(PROJECT_CONSTANT.PROJECT_NOT_FOUND);
            throw new BadRequestException([PROJECT_CONSTANT.PROJECT_NOT_FOUND]);
        }

        const experiment = new this.ExperimentModel(experimentAddDto);
        experiment.user = experimentAddDto.userId;
        experiment.project = experimentAddDto.projectId;
        await experiment.save();
    }

    async getExperimentListByProject(req: Request, projectId: string, projectVersion: string): Promise<PaginateResult<IExperiment>> {
        const { page, limit, search, searchValue } = req.query;
        const searchQuery = search && search === 'true' && searchValue ? getSearchFilterWithRegexAll(searchValue.toString(), ['experimentVersion']) : {};
        const query = {
            ...searchQuery,
            status: true
        };

        const lookUp = {
            $lookup: {
                from: 'projects',
                let: { project: '$project' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$_id', '$$project']
                            }
                        }
                    },
                    {
                        $match: {
                            $and: [{ $expr: { $eq: ['$name', projectId] } }, { $expr: { $eq: ['$version', projectVersion] } }]
                        }
                    }
                ],
                as: 'project'
            }
        };

        const res = await this.experimentModel.aggregate([
            {
                $match: query
            },
            lookUp,
            {
                $unwind: {
                    path: '$project',
                    preserveNullAndEmptyArrays: false
                }
            },
            ...sortDocumentsBy('updatedAt', 'DESC'),
            {
                $project: {
                    experimentVersion: 1,
                    createdAt: 1,
                    'project.id': 1,
                    'project.name': 1,
                    'project.version': 1
                }
            },
            ...getPaginateDocumentStage(!isNaN(Number(page)) ? Number(page) : 1, !isNaN(Number(limit)) ? Number(limit) : 10)
        ]);

        return buildPaginateResult(res[0] as PaginateResult<IExperiment>);
    }

    async getExperimentDetail(id: string): Promise<IExperiment> {
        const logger = new Logger('GetExperimentDetail');
        const experiment = await this.ExperimentModel.findById(id).populate('project user', 'name projectStatus version firstName lastName');
        if (!experiment) {
            logger.error(EXPERIMENT_CONSTANT.EXPERIMENT_NOT_FOUND + ': ' + id);
            throw new BadRequestException([EXPERIMENT_CONSTANT.EXPERIMENT_NOT_FOUND, id]);
        }
        return experiment;
    }
}

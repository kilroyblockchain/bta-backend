import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProjectVersionService } from 'src/components/manage-project/project-version/project-version.service';
import { PaginateModel, PaginateResult } from 'mongoose';
import { IAiModel, IAiModelExp } from './Interfaces/ai-model.interface';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { MANAGE_PROJECT_CONSTANT } from 'src/@core/constants';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { sha256Hash } from 'src/@utils/helpers';
import { VersionBcService } from '../project-version/project-version-bc.service';
import { IProjectVersion } from '../project-version/interfaces/project-version.interface';

@Injectable()
export class AiModelService {
    constructor(
        @InjectModel('ai-model') private readonly aiModel: PaginateModel<IAiModel>,
        private readonly httpService: HttpService,
        @Inject(forwardRef(() => ProjectVersionService)) private readonly versionService: ProjectVersionService,
        @Inject(forwardRef(() => VersionBcService)) private readonly versionBcService: VersionBcService
    ) {}

    async getAllExperiment(req: Request, versionId: string): Promise<PaginateResult<IAiModel>> {
        const version = await this.versionService.getVersionInfo(versionId);
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

        const { page = 1, limit = 10 } = req.query;
        const options = {
            lean: true,
            limit: Number(limit),
            page: Number(page)
        };

        const aiModel = await this.aiModel.paginate({ version: version._id }, options);
        let i = 0;
        const logFileBcHash = [];
        if (!aiModel.docs.length) {
            while (true) {
                try {
                    const { data } = await firstValueFrom(this.httpService.get(`${version.logFilePath}/log_exp_${i}.json`));
                    if (!data) break;
                    const expData = new this.aiModel({
                        expNo: `exp_${i}`,
                        createdAt: data[0].exp.datetime
                    });
                    i++;
                    expData.version = version._id;
                    expData.project = version.project['_id'];
                    expData.experimentBcHash = await sha256Hash(JSON.stringify(data));
                    logFileBcHash.push(expData.experimentBcHash);
                    await expData.save();
                } catch (err) {
                    // version.logFileBCHash = await sha256Hash(JSON.stringify(logFileBcHash));
                    // await this.versionBcService.createBcProjectVersion(req, version);
                    // await version.save();
                    return await this.aiModel.paginate({ version: version._id }, options);
                }
            }
        }

        return aiModel;
    }

    async getExperimentDetails(id: string): Promise<IAiModelExp> {
        const experiment = await this.aiModel.findOne({ _id: id }).populate('version', 'logFilePath');
        if (!experiment) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND);

        const logFileURL = `${experiment.version['logFilePath']}/log_${experiment.expNo}.json`;
        const { data } = await firstValueFrom(this.httpService.get(logFileURL));

        return data;
    }

    async getExperimentInfo(id: string): Promise<IAiModel> {
        const experimentInfo = await this.aiModel.findOne({ _id: id }).populate('version').populate('project', 'name');
        if (!experimentInfo) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND);

        return experimentInfo;
    }

    async getLogExperiment(req: Request, versionId: string): Promise<IProjectVersion> {
        const version = await this.versionService.getVersionInfo(versionId);
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

        let i = 0;
        const logFileBcHash = [];
        while (true) {
            try {
                const { data } = await firstValueFrom(this.httpService.get(`${version.logFilePath}/log_exp_${i}.json`));
                if (!data) break;
                i++;
                logFileBcHash.push(await sha256Hash(JSON.stringify(data)));
            } catch (err) {
                version.logFileBCHash = await sha256Hash(JSON.stringify(logFileBcHash));
                await this.versionBcService.createBcProjectVersion(req, version);
                return await version.save();
            }
        }
    }
}

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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VERSION_ALL_ORACLE_BC_HASHES } from 'src/@utils/events/constants/events.constants';
import { OracleBucketDataStatus } from '../project-version/enum/version-status.enum';

@Injectable()
export class AiModelService {
    constructor(
        @InjectModel('ai-model') private readonly aiModel: PaginateModel<IAiModel>,
        private readonly httpService: HttpService,
        private eventEmitter: EventEmitter2,
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

        return await this.aiModel.paginate({ version: version._id }, options);
    }

    async getExperimentDetails(id: string): Promise<IAiModelExp> {
        const experiment = await this.aiModel.findOne({ _id: id }).populate('version', 'logFilePath');
        if (!experiment) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND);

        const logFileURL = `${experiment.version['logFilePath']}/log_${experiment.expNo}.json`;
        const { data } = await firstValueFrom(this.httpService.get(logFileURL));

        return data;
    }

    async getAllExperimentDetails(versionId: string): Promise<IAiModelExp[]> {
        const version = await this.versionService.getVersionById(versionId);
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

        const allExperimentDetails = [];
        const getAllExperiments = await this.aiModel.find({ version: versionId });
        for (const exp of getAllExperiments) {
            const experimentDetails = await this.getExperimentDetails(exp._id);
            if (!experimentDetails) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND);
            allExperimentDetails.push(experimentDetails);
        }

        return allExperimentDetails;
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

    async getAllOracleDataBcHash(req: Request, versionId: string): Promise<void> {
        const version = await this.versionService.getVersionInfo(versionId);
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

        this.eventEmitter.emit(VERSION_ALL_ORACLE_BC_HASHES, {
            version,
            req
        });
    }

    async getLogFileHash(versionId: string, req: Request): Promise<IProjectVersion> {
        const version = await this.versionService.getVersionInfo(versionId);
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

        version.logFileStatus.code = OracleBucketDataStatus.FETCHING;
        await version.save();

        await this.aiModel.deleteMany({ version: versionId });

        let i = 0;
        let counter = 0;
        const logFileBcHash = [];
        try {
            while (true) {
                const { data } = await firstValueFrom(this.httpService.get(version.logFilePath + `/log_exp_${i}.json`));

                if (!data) break;
                const expData = new this.aiModel({
                    expNo: `exp_${i}`,
                    createdAt: data[0].exp.datetime
                });
                i++;
                counter++;

                expData.version = version._id;
                expData.project = version.project['_id'];
                expData.experimentBcHash = await sha256Hash(JSON.stringify(data));
                logFileBcHash.push(expData.experimentBcHash);
                await expData.save();
            }
        } catch (err) {
            const errorStatus = err.response.data.code;
            const errorMessage = err.response.data.message;

            if (logFileBcHash.length) {
                version.logFileBCHash = await sha256Hash(JSON.stringify(logFileBcHash));
                version.logFileStatus.code = OracleBucketDataStatus.FETCHED;

                await this.versionBcService.createBcProjectVersion(req, version);
                return await version.save();
            }
            if (!counter && errorStatus) {
                version.logFileStatus.code = OracleBucketDataStatus.ERROR;
                version.logFileStatus.message = errorMessage;

                return await version.save();
            }
        }
    }

    async getTestDataBcHash(versionId: string, req: Request): Promise<IProjectVersion> {
        const version = await this.versionService.getVersionInfo(versionId);
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

        version.testDatasetStatus.code = OracleBucketDataStatus.FETCHING;
        await version.save();

        try {
            const { data } = await firstValueFrom(this.httpService.get(version.testDataSets));

            version.testDatasetBCHash = await sha256Hash(JSON.stringify(data));
            version.testDatasetStatus.code = OracleBucketDataStatus.FETCHED;

            await this.versionBcService.createBcProjectVersion(req, version);
            return await version.save();
        } catch (err) {
            const errorStatus = err.response.data.code;
            const errorMessage = err.response.data.message;

            if (errorStatus) {
                version.testDatasetStatus.code = OracleBucketDataStatus.ERROR;
                version.testDatasetStatus.message = errorMessage;

                return await version.save();
            }
        }
    }

    async getTrainDataSetsBcHash(versionId: string, req: Request): Promise<IProjectVersion> {
        const version = await this.versionService.getVersionInfo(versionId);
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

        version.trainDatasetStatus.code = OracleBucketDataStatus.FETCHING;
        await version.save();

        try {
            const { data } = await firstValueFrom(this.httpService.get(version.trainDataSets));

            version.trainDatasetBCHash = await sha256Hash(JSON.stringify(data));
            version.trainDatasetStatus.code = OracleBucketDataStatus.FETCHED;

            await this.versionBcService.createBcProjectVersion(req, version);
            return await version.save();
        } catch (err) {
            const errorStatus = err.response.data.code;
            const errorMessage = err.response.data.message;

            if (errorStatus) {
                version.trainDatasetStatus.code = OracleBucketDataStatus.ERROR;
                version.trainDatasetStatus.message = errorMessage;

                return await version.save();
            }
        }
    }

    async getAiModelBcHash(versionId: string, req: Request): Promise<IProjectVersion> {
        const version = await this.versionService.getVersionInfo(versionId);
        if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

        version.aiModelStatus.code = OracleBucketDataStatus.FETCHING;
        await version.save();

        let i = 0;
        let counter = 0;
        const aiModelBcHash = [];

        try {
            while (true) {
                const { data } = await firstValueFrom(this.httpService.get(version.aiModel + `/${version.project['name'].toLowerCase()}_model_${i}.pkl`));
                if (!data) break;
                i++;
                counter++;
                aiModelBcHash.push(await sha256Hash(JSON.stringify(data)));
            }
        } catch (err) {
            const errorStatus = err.response.data.code;
            const errorMessage = err.response.data.message;

            if (aiModelBcHash.length) {
                version.aiModelBcHash = await sha256Hash(JSON.stringify(aiModelBcHash));
                version.aiModelStatus.code = OracleBucketDataStatus.FETCHED;

                await this.versionBcService.createBcProjectVersion(req, version);
                return await version.save();
            }

            if (!counter && errorStatus) {
                version.aiModelStatus.code = OracleBucketDataStatus.ERROR;
                version.aiModelStatus.message = errorMessage;

                return await version.save();
            }
        }
    }
}

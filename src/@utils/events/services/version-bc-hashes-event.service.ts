import { Injectable } from '@nestjs/common';
import { IProjectVersion } from 'src/components/manage-project/project-version/interfaces/project-version.interface';
import { sha256Hash } from 'src/@utils/helpers';
import { VersionBcService } from 'src/components/manage-project/project-version/project-version-bc.service';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { IAiModel } from 'src/components/manage-project/ai-model/Interfaces/ai-model.interface';
import { OracleBucketDataStatus } from 'src/components/manage-project/project-version/enum/version-status.enum';

@Injectable()
export class VersionBcHashesEventService {
    constructor(@InjectModel('ai-model') private readonly aiModel: PaginateModel<IAiModel>, private readonly versionBcService: VersionBcService, private readonly httpService: HttpService) {}

    async versionAllBcHashesEvent(version: IProjectVersion, req: Request): Promise<void> {
        await this.getLogFileBcHash(version);
        await this.getTestDataSetsBCHash(version);
        await this.getTrainDataSetsBcHash(version);
        this.getAiModelBcHash(version);
        await this.versionBcService.createBcProjectVersion(req, version);
    }

    async getLogFileBcHash(version: IProjectVersion): Promise<void> {
        let i = 0;
        let counter = 0;

        const logFileBCHash = [];
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
                logFileBCHash.push(expData.experimentBcHash);
                await expData.save();
            }
        } catch (err) {
            const errorStatus = err.response.data.code;
            const errorMessage = err.response.data.message;
            if (logFileBCHash.length) {
                version.logFileBCHash = await sha256Hash(JSON.stringify(logFileBCHash));
                version.logFileStatus.code = OracleBucketDataStatus.FETCHED;

                await version.save();
            }
            if (!counter && errorStatus) {
                version.logFileStatus.code = OracleBucketDataStatus.ERROR;
                version.logFileStatus.message = errorMessage;

                await version.save();
            }
        }
    }

    async getTestDataSetsBCHash(version: IProjectVersion): Promise<void> {
        try {
            const { data } = await firstValueFrom(this.httpService.get(version.testDataSets));

            version.testDatasetBCHash = await sha256Hash(JSON.stringify(data));
            version.testDatasetStatus.code = OracleBucketDataStatus.FETCHED;

            await version.save();
        } catch (err) {
            const errorStatus = err.response.data.code;
            const errorMessage = err.response.data.message;

            if (errorStatus) {
                version.testDatasetStatus.code = OracleBucketDataStatus.ERROR;
                version.testDatasetStatus.message = errorMessage;

                await version.save();
            }
        }
    }

    async getTrainDataSetsBcHash(version: IProjectVersion): Promise<void> {
        try {
            const { data } = await firstValueFrom(this.httpService.get(version.trainDataSets));

            version.trainDatasetBCHash = await sha256Hash(JSON.stringify(data));
            version.trainDatasetStatus.code = OracleBucketDataStatus.FETCHED;
            await version.save();
        } catch (err) {
            const errorStatus = err.response.data.code;
            const errorMessage = err.response.data.message;

            if (errorStatus) {
                version.trainDatasetStatus.code = OracleBucketDataStatus.ERROR;
                version.trainDatasetStatus.message = errorMessage;

                await version.save();
            }
        }
    }

    async getAiModelBcHash(version: IProjectVersion): Promise<void> {
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

                await version.save();
            }

            if (!counter && errorStatus) {
                version.aiModelStatus.code = OracleBucketDataStatus.ERROR;
                version.aiModelStatus.message = errorMessage;

                await version.save();
            }
        }
    }
}

import { Injectable } from '@nestjs/common';
import { IProjectVersion } from 'src/components/manage-project/project-version/interfaces/project-version.interface';
import { sha256Hash } from 'src/@utils/helpers';
import { VersionBcService } from 'src/components/manage-project/project-version/project-version-bc.service';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAiModel } from 'src/components/manage-project/ai-model/interfaces/ai-model.interface';
import { OracleBucketDataStatus } from 'src/components/manage-project/project-version/enum/version-status.enum';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { IAiArtifactsModel } from 'src/components/manage-project/ai-model/interfaces/ai-artifacts-model.interface';
import { AIModelBcService } from 'src/components/manage-project/ai-model/ai-model-bc.service';
import * as stream from 'node:stream';
import * as util from 'node:util';

const pathName = process.cwd() + `/uploads/oracle-ai-model-data`;
const pipeline = util.promisify(stream.pipeline);

@Injectable()
export class VersionBcHashesEventService {
    constructor(
        @InjectModel('ai-model') private readonly aiModel: Model<IAiModel>,
        @InjectModel('ai-artifacts-model') private readonly aiArtifactsModel: Model<IAiArtifactsModel>,
        private readonly versionBcService: VersionBcService,
        private readonly httpService: HttpService,
        private readonly aiModelBcService: AIModelBcService
    ) {}

    async versionAllBcHashesEvent(version: IProjectVersion, req: Request): Promise<void> {
        await this.getLogFileBcHash(version, req);
        await this.getTestDataSetsBCHash(version);
        await this.getTrainDataSetsBcHash(version);
        await this.getAiModelBcHash(version, req);

        this.versionBcService.createBcProjectVersion(req, version);
    }

    async modelReviewedBcHashesEvent(version: IProjectVersion, req: Request): Promise<void> {
        await this.getLogFileBcHash(version, req);
        await this.getTestDataSetsBCHash(version);

        this.versionBcService.createBcProjectVersion(req, version);
    }

    async getLogFileBcHash(version: IProjectVersion, req: Request): Promise<void> {
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
                const experiment = await expData.save();
                await this.aiModelBcService.createBcExperiment(req, experiment);
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
        const randomName = crypto.randomUUID();
        const fileName = `ai-model-data-test-data-sets-${randomName}.txt`;

        if (!fs.existsSync(pathName)) {
            fs.mkdirSync(pathName, { recursive: true });
        }

        try {
            const { data } = await firstValueFrom(
                this.httpService.get(version.testDataSets, {
                    responseType: 'stream'
                })
            );

            await pipeline(
                data,
                fs.createWriteStream(pathName + '/' + fileName, {
                    flags: 'a'
                })
            );
            await this.getTestDataSetBcHash(pathName, fileName, version);
        } catch (err) {
            let streamString = '';

            const errorConcatation = new stream.Transform({
                transform(chunk, encoding, callback): void {
                    streamString += chunk;
                    callback(null, chunk);
                }
            });

            await pipeline(err.response.data, errorConcatation);

            version.testDatasetStatus.code = OracleBucketDataStatus.ERROR;
            version.testDatasetStatus.message = JSON.parse(streamString).message;

            await version.save();
        }
    }

    async getTestDataSetBcHash(pathName: string, fileName: string, version: IProjectVersion): Promise<void> {
        const hash = crypto.createHash('sha256');
        hash.setEncoding('hex');

        await pipeline(fs.createReadStream(pathName + '/' + fileName), hash);

        hash.end();
        version.testDatasetBCHash = hash.read();
        version.testDatasetStatus.code = OracleBucketDataStatus.FETCHED;
        await version.save();

        if (fs.existsSync(pathName)) {
            fs.unlinkSync(pathName + '/' + fileName);
        }
    }

    async getTrainDataSetsBcHash(version: IProjectVersion): Promise<void> {
        const randomName = crypto.randomUUID();
        const fileName = `ai-model-data-train-data-sets-${randomName}.txt`;

        if (!fs.existsSync(pathName)) {
            fs.mkdirSync(pathName, { recursive: true });
        }

        try {
            const { data } = await firstValueFrom(
                this.httpService.get(version.trainDataSets, {
                    responseType: 'stream'
                })
            );

            await pipeline(
                data,
                fs.createWriteStream(pathName + '/' + fileName, {
                    flags: 'a'
                })
            );

            await this.getTrainDataSetBcHash(pathName, fileName, version);
        } catch (err) {
            let streamString = '';

            const errorConcatation = new stream.Transform({
                transform(chunk, encoding, callback): void {
                    streamString += chunk;
                    callback(null, chunk);
                }
            });

            await pipeline(err.response.data, errorConcatation);

            version.testDatasetStatus.code = OracleBucketDataStatus.ERROR;
            version.testDatasetStatus.message = JSON.parse(streamString).message;

            await version.save();
        }
    }

    async getTrainDataSetBcHash(pathName: string, fileName: string, version: IProjectVersion): Promise<void> {
        const hash = crypto.createHash('sha256');
        hash.setEncoding('hex');

        await pipeline(fs.createReadStream(pathName + '/' + fileName), hash);

        hash.end();
        version.trainDatasetBCHash = hash.read();
        version.trainDatasetStatus.code = OracleBucketDataStatus.FETCHED;
        await version.save();

        if (fs.existsSync(pathName)) {
            fs.unlinkSync(pathName + '/' + fileName);
        }
    }

    async getAiModelBcHash(version: IProjectVersion, req: Request): Promise<void> {
        const randomName = crypto.randomUUID();
        const fileName = `ai-model-data-${randomName}.pkl`;

        if (!fs.existsSync(pathName)) {
            fs.mkdirSync(pathName, { recursive: true });
        }

        const getAIModel = async (counter = 0): Promise<void> => {
            try {
                const { data } = await firstValueFrom(
                    this.httpService.get(version.aiModel + `/${version.project['name'].toLowerCase()}_model_${counter}.pkl`, {
                        responseType: 'stream'
                    })
                );

                await pipeline(
                    data,
                    fs.createWriteStream(pathName + '/' + fileName, {
                        flags: 'a'
                    })
                );

                await this.aiArtifactsModelBcHash(version, counter, req);
                counter++;
                await getAIModel(counter);
            } catch (err) {
                if (!counter) {
                    let streamString = '';
                    const errorConcatation = new stream.Transform({
                        transform(chunk, encoding, callback): void {
                            streamString += chunk;
                            callback(null, chunk);
                        }
                    });

                    await pipeline(err.response.data, errorConcatation);

                    version.aiModelStatus.code = OracleBucketDataStatus.ERROR;
                    version.aiModelStatus.message = JSON.parse(streamString).message;

                    await version.save();
                } else {
                    await this.createAiModelOracleDataHash(pathName, fileName, version);
                }
            }
        };

        await getAIModel();
    }

    async createAiModelOracleDataHash(pathName: string, fileName: string, version: IProjectVersion): Promise<void> {
        const hash = crypto.createHash('sha256');
        hash.setEncoding('hex');

        await pipeline(fs.createReadStream(pathName + '/' + fileName), hash);

        hash.end();
        version.aiModelBcHash = hash.read();
        version.aiModelStatus.code = OracleBucketDataStatus.FETCHED;
        await version.save();

        if (fs.existsSync(pathName)) {
            fs.unlinkSync(pathName + '/' + fileName);
        }
    }

    async aiArtifactsModelBcHash(version: IProjectVersion, counter: number, req: Request): Promise<void> {
        const randomName = crypto.randomUUID();
        const pathName = process.cwd() + `/uploads/oracle-ai-model-data/artifacts-model`;
        const fileName = `ai-model-data-${counter}-${randomName}.pkl`;

        if (!fs.existsSync(pathName)) {
            fs.mkdirSync(pathName, { recursive: true });
        }
        const { data } = await firstValueFrom(
            this.httpService.get(version.aiModel + `/${version.project['name'].toLowerCase()}_model_${counter}.pkl`, {
                responseType: 'stream'
            })
        );

        await pipeline(
            data,
            fs.createWriteStream(pathName + '/' + fileName, {
                flags: 'a'
            })
        );

        await this.getOracleDataHash(pathName, fileName, counter, version, req);
    }

    async getOracleDataHash(pathName: string, fileName: string, counter: number, version: IProjectVersion, req: Request): Promise<void> {
        const hash = crypto.createHash('sha256');
        hash.setEncoding('hex');

        await pipeline(fs.createReadStream(pathName + '/' + fileName), hash);
        hash.end();

        const aiArtifactsModelData = new this.aiArtifactsModel({
            modelBcHash: hash.read(),
            modelNo: `${version.project['name'].toLowerCase()}_model_${counter}`,
            version: version._id,
            project: version.project['_id']
        });

        await aiArtifactsModelData.save();
        await this.aiModelBcService.createBcArtifactsModel(req, aiArtifactsModelData);

        if (fs.existsSync(pathName)) {
            fs.unlinkSync(pathName + '/' + fileName);
        }
    }
}

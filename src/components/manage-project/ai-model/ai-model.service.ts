import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProjectVersionService } from 'src/components/manage-project/project-version/project-version.service';
import { PaginateModel, PaginateResult } from 'mongoose';
import { IAiModel, IAiModelExp } from './interfaces/ai-model.interface';
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
import { IAIModelTempHash } from './interfaces/ai-model-temp-hash.interface';
import { IAiArtifactsModel } from './interfaces/ai-artifacts-model.interface';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { AIModelBcService } from './ai-model-bc.service';

@Injectable()
export class AiModelService {
    constructor(
        @InjectModel('ai-model') private readonly aiModel: PaginateModel<IAiModel>,
        @InjectModel('ai-model-temp-hash') private readonly aiModelTempHash: PaginateModel<IAIModelTempHash>,
        @InjectModel('ai-artifacts-model') private readonly aiArtifactsModel: PaginateModel<IAiArtifactsModel>,
        private readonly httpService: HttpService,
        private eventEmitter: EventEmitter2,
        @Inject(forwardRef(() => ProjectVersionService)) private readonly versionService: ProjectVersionService,
        @Inject(forwardRef(() => VersionBcService)) private readonly versionBcService: VersionBcService,
        private readonly aiModelBcService: AIModelBcService
    ) {}

    async getAllExperiment(req: Request, versionId: string): Promise<PaginateResult<IAiModel>> {
        const logger = new Logger(AiModelService.name + '-getAllExperiment');
        try {
            const version = await this.versionService.getVersionInfo(versionId);
            if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

            const { page = 1, limit = 10 } = req.query;
            const options = {
                lean: true,
                limit: Number(limit),
                page: Number(page)
            };

            return await this.aiModel.paginate({ version: version._id }, options);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getExperimentDetails(id: string): Promise<IAiModelExp> {
        const logger = new Logger(AiModelService.name + '-getExperimentDetails');
        try {
            const experiment = await this.aiModel.findOne({ _id: id }).populate('version', 'logFilePath');
            if (!experiment) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND);

            const logFileURL = `${experiment.version['logFilePath']}/log_${experiment.expNo}.json`;
            const { data } = await firstValueFrom(this.httpService.get(logFileURL));

            return data;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getAllExperimentDetails(versionId: string): Promise<IAiModelExp[]> {
        const logger = new Logger(AiModelService.name + '-getAllExperimentDetails');
        try {
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
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getExperimentInfo(id: string): Promise<IAiModel> {
        const logger = new Logger(AiModelService.name + '-getAllExperimentDetails');
        try {
            const experimentInfo = await this.aiModel.findOne({ _id: id }).populate('version').populate('project', 'name');
            if (!experimentInfo) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND);

            return experimentInfo;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getLogExperiment(req: Request, versionId: string): Promise<IProjectVersion> {
        const logger = new Logger(AiModelService.name + '-getLogExperiment');
        try {
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
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getAllOracleDataBcHash(req: Request, versionId: string, getBcHashActionType: string): Promise<void> {
        const logger = new Logger(AiModelService.name + '-getAllOracleDataBcHash');
        try {
            const version = await this.versionService.getVersionInfo(versionId);
            if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

            this.eventEmitter.emit(VERSION_ALL_ORACLE_BC_HASHES, {
                version,
                req,
                getBcHashActionType
            });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getLogFileHash(versionId: string, req: Request): Promise<IProjectVersion> {
        const logger = new Logger(AiModelService.name + '-getLogFileHash');
        try {
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
                    const experiment = await expData.save();
                    await this.aiModelBcService.createBcExperiment(req, experiment);
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
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getTestDataBcHash(versionId: string, req: Request): Promise<void> {
        const logger = new Logger(AiModelService.name + '-getTestDataBcHash');
        try {
            const version = await this.versionService.getVersionInfo(versionId);
            if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

            version.testDatasetStatus.code = OracleBucketDataStatus.FETCHING;
            await version.save();

            const randomName = crypto.randomUUID();

            const pathName = process.cwd() + `/uploads/oracle-ai-model-data/test-data-sets`;
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

                const writer = data.pipe(
                    fs.createWriteStream(pathName + '/' + fileName, {
                        flags: 'a'
                    })
                );

                writer.on('finish', async () => {
                    await this.getTestDataSetBcHash(pathName, fileName, version, req);
                });
            } catch (err) {
                let streamString = '';
                err.response.data.setEncoding('utf8');
                err.response.data
                    .on('data', (utf8Chunk) => {
                        streamString += utf8Chunk;
                    })
                    .on('end', async () => {
                        version.testDatasetStatus.code = OracleBucketDataStatus.ERROR;
                        version.testDatasetStatus.message = JSON.parse(streamString).message;

                        await version.save();
                    });
            }
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getTestDataSetBcHash(pathName: string, fileName: string, version: IProjectVersion, req: Request): Promise<void> {
        const logger = new Logger(AiModelService.name + '-getTestDataSetBcHash');
        try {
            const readStream = fs.createReadStream(pathName + '/' + fileName);

            const hash = crypto.createHash('sha256');
            hash.setEncoding('hex');

            readStream.pipe(hash);

            readStream.on('end', async () => {
                hash.end();
                version.testDatasetBCHash = hash.read();
                version.testDatasetStatus.code = OracleBucketDataStatus.FETCHED;

                await version.save();
                await this.versionBcService.createBcProjectVersion(req, version);
                if (fs.existsSync(pathName)) {
                    fs.unlinkSync(pathName + '/' + fileName);
                }
            });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getTrainDataSetsBcHash(versionId: string, req: Request): Promise<void> {
        const logger = new Logger(AiModelService.name + '-getTrainDataSetsBcHash');
        try {
            const version = await this.versionService.getVersionInfo(versionId);
            if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

            version.trainDatasetStatus.code = OracleBucketDataStatus.FETCHING;
            await version.save();

            const randomName = crypto.randomUUID();

            const pathName = process.cwd() + `/uploads/oracle-ai-model-data/train-data-sets`;
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

                const writer = data.pipe(
                    fs.createWriteStream(pathName + '/' + fileName, {
                        flags: 'a'
                    })
                );

                writer.on('finish', async () => {
                    await this.getTrainDataSetBcHash(pathName, fileName, version, req);
                });
            } catch (err) {
                let streamString = '';
                err.response.data.setEncoding('utf8');
                err.response.data
                    .on('data', (utf8Chunk) => {
                        streamString += utf8Chunk;
                    })
                    .on('end', async () => {
                        version.trainDatasetStatus.code = OracleBucketDataStatus.ERROR;
                        version.trainDatasetStatus.message = JSON.parse(streamString).message;

                        await version.save();
                    });
            }
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getTrainDataSetBcHash(pathName: string, fileName: string, version: IProjectVersion, req: Request): Promise<void> {
        const logger = new Logger(AiModelService.name + '-getTrainDataSetBcHash');
        try {
            const readStream = fs.createReadStream(pathName + '/' + fileName);

            const hash = crypto.createHash('sha256');
            hash.setEncoding('hex');

            readStream.pipe(hash);

            readStream.on('end', async () => {
                hash.end();
                version.trainDatasetBCHash = hash.read();
                version.trainDatasetStatus.code = OracleBucketDataStatus.FETCHED;

                await version.save();
                await this.versionBcService.createBcProjectVersion(req, version);
                if (fs.existsSync(pathName)) {
                    fs.unlinkSync(pathName + '/' + fileName);
                }
            });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getAiModelBcHash(versionId: string, req: Request): Promise<void> {
        const logger = new Logger(AiModelService.name + '-getAiModelBcHash');
        try {
            const version = await this.versionService.getVersionInfo(versionId);
            if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

            await this.aiArtifactsModel.deleteMany({ version: version._id });

            version.aiModelStatus.code = OracleBucketDataStatus.FETCHING;
            await version.save();

            const randomName = crypto.randomUUID();

            const pathName = process.cwd() + `/uploads/oracle-ai-model-data/artifacts-model`;
            const fileName = `ai-model-data-${randomName}.pkl`;

            if (!fs.existsSync(pathName)) {
                fs.mkdirSync(pathName, { recursive: true });
            }

            const getAIModel = async (counter = 0): Promise<void> => {
                try {
                    const { data } = await firstValueFrom(
                        this.httpService.get(version.aiModel + `/${version.project['name']}_model_${counter}.pkl`, {
                            responseType: 'stream'
                        })
                    );

                    const writer = data.pipe(
                        fs.createWriteStream(pathName + '/' + fileName, {
                            flags: 'a'
                        })
                    );

                    writer.on('finish', async () => {
                        await this.aiArtifactsModelBcHash(version, counter, req);
                        counter++;
                        getAIModel(counter);
                    });
                } catch (err) {
                    if (!counter) {
                        let streamString = '';
                        err.response.data.setEncoding('utf8');
                        err.response.data
                            .on('data', (utf8Chunk) => {
                                streamString += utf8Chunk;
                            })
                            .on('end', async () => {
                                version.aiModelStatus.code = OracleBucketDataStatus.ERROR;
                                version.aiModelStatus.message = JSON.parse(streamString).message;

                                await version.save();
                            });
                    } else {
                        this.getAIModelBcHash(pathName, fileName, version, req);
                    }
                }
            };

            getAIModel();
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getAIModelBcHash(pathName: string, fileName: string, version: IProjectVersion, req: Request): Promise<void> {
        const logger = new Logger(AiModelService.name + '-getAIModelBcHash');
        try {
            const readStream = fs.createReadStream(pathName + '/' + fileName);

            const hash = crypto.createHash('sha256');
            hash.setEncoding('hex');

            readStream.pipe(hash);

            readStream.on('end', async () => {
                hash.end();
                version.aiModelBcHash = hash.read();
                version.aiModelStatus.code = OracleBucketDataStatus.FETCHED;

                await version.save();
                await this.versionBcService.createBcProjectVersion(req, version);
                if (fs.existsSync(pathName)) {
                    fs.unlinkSync(pathName + '/' + fileName);
                }
            });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async aiArtifactsModelBcHash(version: IProjectVersion, counter: number, req: Request): Promise<void> {
        const logger = new Logger(AiModelService.name + '-aiArtifactsModelBcHash');
        try {
            const pathName = process.cwd() + `/uploads/oracle-ai-model-data/artifacts-model`;
            const randomName = crypto.randomUUID();
            const fileName = `ai-model-data-${randomName}-${counter}.pkl`;

            if (!fs.existsSync(pathName)) {
                fs.mkdirSync(pathName, { recursive: true });
            }
            const { data } = await firstValueFrom(
                this.httpService.get(version.aiModel + `/${version.project['name']}_model_${counter}.pkl`, {
                    responseType: 'stream'
                })
            );

            const writer = data.pipe(
                fs.createWriteStream(pathName + '/' + fileName, {
                    flags: 'a'
                })
            );

            writer.on('finish', () => {
                this.getArtifactModelOracleHash(pathName, fileName, counter, version, req);
            });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getArtifactModelOracleHash(pathName: string, fileName: string, counter: number, version: IProjectVersion, req: Request): Promise<void> {
        const logger = new Logger(AiModelService.name + '-getArtifactModelOracleHash');
        try {
            const readStream = fs.createReadStream(pathName + '/' + fileName);

            const hash = crypto.createHash('sha256');
            hash.setEncoding('hex');

            readStream.pipe(hash);

            readStream.on('end', async () => {
                hash.end();

                const aiArtifactsModelData = new this.aiArtifactsModel({
                    modelBcHash: hash.read(),
                    modelNo: `${version.project['name']}_model_${counter}`,
                    version: version._id,
                    project: version.project['_id']
                });
                const aiArtifactsModel = await aiArtifactsModelData.save();
                this.aiModelBcService.createBcArtifactsModel(req, aiArtifactsModel);

                if (fs.existsSync(pathName)) {
                    fs.unlinkSync(pathName + '/' + fileName);
                }
            });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getLogFileOracleBcHash(versionId: string): Promise<string> {
        const logger = new Logger(AiModelService.name + '-getArtifactModelOracleHash');
        try {
            const version = await this.versionService.getVersionById(versionId);
            if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

            let i = 0;
            const logFileBCHash = [];
            try {
                while (true) {
                    const { data } = await firstValueFrom(this.httpService.get(version.logFilePath + `/log_exp_${i}.json`));
                    if (!data) break;

                    i++;
                    const logFileDataBCHash = await sha256Hash(JSON.stringify(data));
                    logFileBCHash.push(logFileDataBCHash);
                }
            } catch (err) {
                if (logFileBCHash.length) {
                    return await sha256Hash(JSON.stringify(logFileBCHash));
                }
            }
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getTestDataOracleBcHash(versionId: string): Promise<string> {
        const logger = new Logger(AiModelService.name + '-getTestDataOracleBcHash');
        try {
            const version = await this.versionService.getVersionById(versionId);
            if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);
            const randomName = crypto.randomUUID();

            const pathName = process.cwd() + `/uploads/oracle-ai-model-data`;
            const fileName = `ai-model-test-data-set-${randomName}.txt`;

            const tempHash = await new this.aiModelTempHash().save();

            if (!fs.existsSync(pathName)) {
                fs.mkdirSync(pathName, { recursive: true });
            }

            const getTestDataHash = async (): Promise<void> => {
                try {
                    const { data } = await firstValueFrom(
                        this.httpService.get(version.testDataSets, {
                            responseType: 'stream'
                        })
                    );

                    const writer = data.pipe(
                        fs.createWriteStream(pathName + '/' + fileName, {
                            flags: 'a'
                        })
                    );

                    writer.on('finish', async () => {
                        this.createOracleDataHash(pathName, fileName, tempHash._id);
                    });
                } catch (err) {
                    let streamString = '';
                    err.response.data.setEncoding('utf8');
                    err.response.data
                        .on('data', (utf8Chunk) => {
                            streamString += utf8Chunk;
                        })
                        .on('end', async () => {
                            version.testDatasetStatus.code = OracleBucketDataStatus.ERROR;
                            version.testDatasetStatus.message = JSON.parse(streamString).message;

                            await version.save();
                        });
                }
            };
            getTestDataHash();
            return tempHash._id;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getTrainDataOracleBcHash(versionId: string): Promise<string> {
        const logger = new Logger(AiModelService.name + '-getTrainDataOracleBcHash');
        try {
            const version = await this.versionService.getVersionById(versionId);
            if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);
            const randomName = crypto.randomUUID();

            const pathName = process.cwd() + `/uploads/oracle-ai-model-data`;
            const fileName = `ai-model-train-data-set-${randomName}.txt`;

            const tempHash = await new this.aiModelTempHash().save();

            if (!fs.existsSync(pathName)) {
                fs.mkdirSync(pathName, { recursive: true });
            }

            const getTrainDataHash = async (): Promise<void> => {
                try {
                    const { data } = await firstValueFrom(
                        this.httpService.get(version.trainDataSets, {
                            responseType: 'stream'
                        })
                    );

                    const writer = data.pipe(
                        fs.createWriteStream(pathName + '/' + fileName, {
                            flags: 'a'
                        })
                    );

                    writer.on('finish', async () => {
                        this.createOracleDataHash(pathName, fileName, tempHash._id);
                    });
                } catch (err) {
                    let streamString = '';
                    err.response.data.setEncoding('utf8');
                    err.response.data
                        .on('data', (utf8Chunk) => {
                            streamString += utf8Chunk;
                        })
                        .on('end', async () => {
                            version.trainDatasetStatus.code = OracleBucketDataStatus.ERROR;
                            version.trainDatasetStatus.message = JSON.parse(streamString).message;

                            await version.save();
                        });
                }
            };
            getTrainDataHash();
            return tempHash._id;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getAIModelOracleBcHash(versionId: string): Promise<string> {
        const logger = new Logger(AiModelService.name + '-getAIModelOracleBcHash');
        try {
            const version = await this.versionService.getVersionInfo(versionId);
            if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);
            const randomName = crypto.randomUUID();

            const pathName = process.cwd() + `/uploads/oracle-ai-model-data`;
            const fileName = `ai-model-data-${randomName}.pkl`;

            const tempHash = await new this.aiModelTempHash().save();

            if (!fs.existsSync(pathName)) {
                fs.mkdirSync(pathName, { recursive: true });
            }

            const getAIModel = async (counter = 0): Promise<void> => {
                try {
                    const { data } = await firstValueFrom(
                        this.httpService.get(version.aiModel + `/${version.project['name']}_model_${counter}.pkl`, {
                            responseType: 'stream'
                        })
                    );

                    const writer = data.pipe(
                        fs.createWriteStream(pathName + '/' + fileName, {
                            flags: 'a'
                        })
                    );

                    writer.on('finish', () => {
                        counter++;
                        getAIModel(counter);
                    });
                } catch (err) {
                    if (!counter) {
                        let streamString = '';
                        err.response.data.setEncoding('utf8');
                        err.response.data
                            .on('data', (utf8Chunk) => {
                                streamString += utf8Chunk;
                            })
                            .on('end', async () => {
                                version.aiModelStatus.code = OracleBucketDataStatus.ERROR;
                                version.aiModelStatus.message = JSON.parse(streamString).message;

                                await version.save();
                            });
                    } else {
                        this.createOracleDataHash(pathName, fileName, tempHash._id);
                    }
                }
            };

            getAIModel();
            return tempHash._id;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    createOracleDataHash(pathName: string, fileName: string, tempHashId: string): void {
        const logger = new Logger(AiModelService.name + '-createOracleDataHash');
        try {
            const readStream = fs.createReadStream(pathName + '/' + fileName);

            const hash = crypto.createHash('sha256');
            hash.setEncoding('hex');

            readStream.pipe(hash);

            readStream.on('end', async () => {
                hash.end();

                const tempHash = await this.aiModelTempHash.findById(tempHashId);
                if (!tempHash) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.ORACLE_HASH_RECORD_NOT_FOUND);

                tempHash.hash = hash.read();
                await tempHash.save();

                if (fs.existsSync(pathName)) {
                    fs.unlinkSync(pathName + '/' + fileName);
                }
            });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getExperimentOracleBcHash(expId: string): Promise<string> {
        const logger = new Logger(AiModelService.name + '-getExperimentOracleBcHash');
        try {
            const experiment = await this.aiModel.findOne({ _id: expId }).populate('version', 'logFilePath');
            if (!experiment) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND);

            const logFileURL = `${experiment.version['logFilePath']}/log_${experiment.expNo}.json`;
            const { data } = await firstValueFrom(this.httpService.get(logFileURL));

            return await sha256Hash(JSON.stringify(data));
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async downloadExperimentLogFile(expId: string): Promise<string> {
        const logger = new Logger(AiModelService.name + '-downloadExperimentLogFile');
        try {
            const experiment = await this.aiModel.findOne({ _id: expId }).populate('version', 'logFilePath');
            if (!experiment) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND);

            return `${experiment.version['logFilePath']}/log_${experiment.expNo}.json`;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getOracleDataHash(hashId: string): Promise<IAIModelTempHash> {
        const logger = new Logger(AiModelService.name + '-getOracleDataHash');
        try {
            const hash = await this.aiModelTempHash.findOne({ _id: hashId });

            if (!hash) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.ORACLE_HASH_RECORD_NOT_FOUND);

            return hash;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async deleteTempOracleDataHash(hashId: string): Promise<IAIModelTempHash> {
        const logger = new Logger(AiModelService.name + '-deleteTempOracleDataHash');
        try {
            return await this.aiModelTempHash.findOneAndDelete({ _id: hashId });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getExperimentById(expId: string): Promise<IAiModel> {
        const logger = new Logger(AiModelService.name + '-getExperimentById');
        try {
            return await this.aiModel.findOne({ _id: expId }).populate('version', '_id versionStatus');
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getArtifactModel(modelId: string): Promise<IAiArtifactsModel> {
        const logger = new Logger(AiModelService.name + '-getArtifactModel');
        try {
            return await this.aiArtifactsModel.findOne({ _id: modelId }).populate('version', '_id versionStatus');
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getAllArtifactModel(versionId: string, req: Request): Promise<PaginateResult<IAiArtifactsModel>> {
        const logger = new Logger(AiModelService.name + '-getAllArtifactModel');
        try {
            const version = await this.versionService.getVersionInfo(versionId);
            if (!version) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND);

            const { page = 1, limit = 10 } = req.query;
            const options = {
                lean: true,
                limit: Number(limit),
                page: Number(page)
            };

            return await this.aiArtifactsModel.paginate({ version: version._id }, options);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getArtifactModelOracleBcHash(modelId: string): Promise<string> {
        const logger = new Logger(AiModelService.name + '-getArtifactModelOracleBcHash');
        try {
            const artifactModel = await this.aiArtifactsModel.findOne({ _id: modelId }).populate('version', 'versionName aiModel').populate('project', 'name');

            if (!artifactModel) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.ARTIFACT_MODEL_RECORD_NOT_FOUND);

            const randomName = crypto.randomUUID();

            const pathName = process.cwd() + `/uploads/oracle-ai-model-data`;
            const fileName = `ai-model-data-${randomName}.pkl`;

            const tempHash = await new this.aiModelTempHash().save();

            if (!fs.existsSync(pathName)) {
                fs.mkdirSync(pathName, { recursive: true });
            }

            const getArtifactModelHash = async (): Promise<void> => {
                const { data } = await firstValueFrom(
                    this.httpService.get(artifactModel.version['aiModel'] + `/${artifactModel.modelNo}.pkl`, {
                        responseType: 'stream'
                    })
                );

                const writer = data.pipe(
                    fs.createWriteStream(pathName + '/' + fileName, {
                        flags: 'a'
                    })
                );

                writer.on('finish', async () => {
                    this.createOracleDataHash(pathName, fileName, tempHash._id);
                });
            };

            getArtifactModelHash();
            return tempHash._id;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getArtifactModelDetails(expId: string): Promise<string> {
        const logger = new Logger(AiModelService.name + '-getArtifactModelDetails');
        try {
            const experiment = await this.aiModel.findOne({ _id: expId }).populate('project');
            if (!experiment) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND);

            const experimentNo = experiment.expNo.split('_')[1];

            const artifactModel = await this.aiArtifactsModel.findOne({
                modelNo: `${experiment.project['name']}_model_${experimentNo}`,
                version: experiment.version
            });

            if (!artifactModel) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.ARTIFACT_MODEL_RECORD_NOT_FOUND);

            return artifactModel._id;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getAllExperimentIds(versionId: string): Promise<IAiModel[]> {
        const logger = new Logger(AiModelService.name + '-getAllExperimentIds');
        try {
            const experimentIds = await this.aiModel.find({ version: versionId }).select('_id');
            if (!experimentIds.length) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.VERSION_LOG_EXPERIMENT_RECORD_NOT_FOUND);

            return experimentIds;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getAllArtifactModelIds(versionId: string): Promise<IAiArtifactsModel[]> {
        const logger = new Logger(AiModelService.name + '-getAllArtifactModelIds');
        try {
            const artifactModel = await this.aiArtifactsModel.find({ version: versionId }).select('_id');
            if (!artifactModel.length) throw new NotFoundException(MANAGE_PROJECT_CONSTANT.ARTIFACT_MODEL_RECORD_NOT_FOUND);

            return artifactModel;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}

import { Injectable } from '@nestjs/common';
import { IProjectVersion } from 'src/components/manage-project/project-version/interfaces/project-version.interface';
import { sha256Hash } from 'src/@utils/helpers';
import { VersionBcService } from 'src/components/manage-project/project-version/project-version-bc.service';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { IAiModel } from 'src/components/manage-project/ai-model/Interfaces/ai-model.interface';
import { OracleBucketDataStatus } from 'src/components/manage-project/project-version/enum/version-status.enum';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { IAiArtifactsModel } from 'src/components/manage-project/ai-model/Interfaces/ai-artifacts-model.interface';

const pathName = process.cwd() + `/uploads/oracle-ai-model-data`;

@Injectable()
export class VersionBcHashesEventService {
    constructor(@InjectModel('ai-model') private readonly aiModel: PaginateModel<IAiModel>, @InjectModel('ai-artifacts-model') private readonly aiArtifactsModel: Model<IAiArtifactsModel>, private readonly versionBcService: VersionBcService, private readonly httpService: HttpService) {}

    async versionAllBcHashesEvent(version: IProjectVersion, req: Request): Promise<void> {
        await this.getLogFileBcHash(version);
        await this.getTestDataSetsBCHash(version);
        await this.getTrainDataSetsBcHash(version);
        await this.getAiModelBcHash(version);
        this.versionBcService.createBcProjectVersion(req, version);
    }

    async modelReviewedBcHashesEvent(version: IProjectVersion, req: Request): Promise<void> {
        await this.getLogFileBcHash(version);
        await this.getTestDataSetsBCHash(version);
        this.versionBcService.createBcProjectVersion(req, version);
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
        const fileName = `ai-model-data-test-data-sets.txt`;

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
                await this.getTestDataSetBcHash(pathName, fileName, version);
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
    }

    async getTestDataSetBcHash(pathName: string, fileName: string, version: IProjectVersion): Promise<void> {
        const readStream = fs.createReadStream(pathName + '/' + fileName);

        const hash = crypto.createHash('sha256');
        hash.setEncoding('hex');

        readStream.pipe(hash);

        readStream.on('end', async () => {
            hash.end();
            version.testDatasetBCHash = hash.read();
            version.testDatasetStatus.code = OracleBucketDataStatus.FETCHED;
            await version.save();

            if (fs.existsSync(pathName)) {
                fs.unlinkSync(pathName + '/' + fileName);
            }
        });
    }

    async getTrainDataSetsBcHash(version: IProjectVersion): Promise<void> {
        const fileName = `ai-model-data-train-data-sets.txt`;

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
                await this.getTrainDataSetBcHash(pathName, fileName, version);
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
    }

    async getTrainDataSetBcHash(pathName: string, fileName: string, version: IProjectVersion): Promise<void> {
        const readStream = fs.createReadStream(pathName + '/' + fileName);

        const hash = crypto.createHash('sha256');
        hash.setEncoding('hex');

        readStream.pipe(hash);

        readStream.on('end', async () => {
            hash.end();
            version.trainDatasetBCHash = hash.read();
            version.trainDatasetStatus.code = OracleBucketDataStatus.FETCHED;
            await version.save();

            if (fs.existsSync(pathName)) {
                fs.unlinkSync(pathName + '/' + fileName);
            }
        });
    }

    async getAiModelBcHash(version: IProjectVersion): Promise<void> {
        const fileName = 'ai-model-data.pkl';

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

                const writer = data.pipe(
                    fs.createWriteStream(pathName + '/' + fileName, {
                        flags: 'a'
                    })
                );

                writer.on('finish', async () => {
                    await this.aiArtifactsModelBcHash(version, counter);
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
                    this.createOracleDataHash(pathName, fileName, version);
                }
            }
        };

        getAIModel();
    }

    createOracleDataHash(pathName: string, fileName: string, version: IProjectVersion): void {
        const readStream = fs.createReadStream(pathName + '/' + fileName);

        const hash = crypto.createHash('sha256');
        hash.setEncoding('hex');

        readStream.pipe(hash);

        readStream.on('end', async () => {
            hash.end();
            version.aiModelBcHash = hash.read();
            version.aiModelStatus.code = OracleBucketDataStatus.FETCHED;
            await version.save();

            if (fs.existsSync(pathName)) {
                fs.unlinkSync(pathName + '/' + fileName);
            }
        });
    }

    async aiArtifactsModelBcHash(version: IProjectVersion, counter: number): Promise<void> {
        const pathName = process.cwd() + `/uploads/oracle-ai-model-data/artifacts-model`;
        const fileName = `ai-model-data-${counter}.pkl`;

        if (!fs.existsSync(pathName)) {
            fs.mkdirSync(pathName, { recursive: true });
        }
        const { data } = await firstValueFrom(
            this.httpService.get(version.aiModel + `/${version.project['name'].toLowerCase()}_model_${counter}.pkl`, {
                responseType: 'stream'
            })
        );

        const writer = data.pipe(
            fs.createWriteStream(pathName + '/' + fileName, {
                flags: 'a'
            })
        );

        writer.on('finish', () => {
            this.getOracleDataHash(pathName, fileName, counter, version);
        });
    }

    async getOracleDataHash(pathName: string, fileName: string, counter: number, version: IProjectVersion): Promise<void> {
        const readStream = fs.createReadStream(pathName + '/' + fileName);

        const hash = crypto.createHash('sha256');
        hash.setEncoding('hex');

        readStream.pipe(hash);

        readStream.on('end', async () => {
            hash.end();

            const aiArtifactsModelData = new this.aiArtifactsModel({
                modelBcHash: hash.read(),
                modelNo: `${version.project['name'].toLowerCase()}_model_${counter}`,
                version: version._id,
                project: version.project['_id']
            });
            await aiArtifactsModelData.save();

            if (fs.existsSync(pathName)) {
                fs.unlinkSync(pathName + '/' + fileName);
            }
        });
    }
}

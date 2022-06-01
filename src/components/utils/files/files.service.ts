import { BadRequestException, Injectable, Logger, NotFoundException, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import * as multi from 'multistream';

@Injectable()
export class FileService {
    createJSONFile(jsonObject: JSON, fileName: string, filepath?: string): string {
        const logger = new Logger(FileService.name + '-createJSONFile');
        try {
            fileName = fileName.trim().replace(' ', '_');
            fileName = fileName + Date.now();
            const savingPath = filepath ? `/uploads/${filepath}/` : '/uploads/json/';
            const JSONPath = process.cwd() + savingPath;
            if (!fs.existsSync(JSONPath)) {
                fs.mkdirSync(JSONPath);
            }
            if (!fs.existsSync(process.cwd() + '/uploads/temp/')) {
                this.cleanTempDir();
            }
            const fullPath = `${JSONPath}${fileName.includes('.json') ? fileName : fileName + '-' + Math.floor(1000 + Math.random() * 9000) + '.json'}`;
            const jsonObjectStringified = JSON.stringify(jsonObject);
            fs.writeFileSync(fullPath, jsonObjectStringified, 'utf8');
            return fullPath;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    cleanTempDir(): void {
        const logger = new Logger(FileService.name + '-cleanTempDir');
        try {
            const files = fs.readdirSync(process.cwd() + '/uploads/temp/');
            files.forEach((file) => {
                if (new Date().getTime() > Number(file.split('-')[0]) + 2 * 60 * 60 * 1000) {
                    fs.unlinkSync(process.cwd() + '/uploads/temp/' + file);
                }
            });
        } catch (err) {
            logger.error(err);
        }
    }

    streamLogs(): StreamableFile {
        const logger = new Logger(FileService.name + '-streamLogs');
        let files: { fileName: string; logTimeStamp: Date }[] = [];
        try {
            files = (fs.readdirSync(join(process.cwd(), 'logs')) ?? []).reduce((logsDetailList, log) => {
                if (log.includes('application-') && !log.includes('.gz')) {
                    logsDetailList.push({
                        fileName: log,
                        logTimeStamp: this.getDateFromLogsDateString(log.substring(12).split('.')[0])
                    });
                }
                return logsDetailList;
            }, []);
        } catch (err) {
            logger.error(err);
            throw new NotFoundException('Logs file not found');
        }
        try {
            files.sort((a, b) => {
                return a.logTimeStamp.getTime() - b.logTimeStamp.getTime();
            });
            const streamFiles = [];
            files.forEach((file) => {
                try {
                    const streamFile = fs.createReadStream(join(process.cwd(), `logs/${file.fileName}`));
                    if (streamFile) {
                        streamFiles.push(streamFile);
                    }
                } catch (err) {
                    logger.error(err);
                }
            });
            const combinedStreams = new multi(streamFiles);
            return new StreamableFile(combinedStreams);
        } catch (err) {
            logger.error(err);
            throw new BadRequestException('Failed to get logs');
        }
    }

    getDateFromLogsDateString(dateString: string): Date {
        const logger = new Logger(FileService.name + '-getDateFromLogsDateString');
        try {
            const apiLogDatePattern = process.env.APP_LOG_DATE_PATTERN ?? 'YYYY-MM-DD';
            const datePartsTitle = apiLogDatePattern.split('-');
            const datePartsValue = dateString.split('-');
            const formattedDateString = datePartsTitle
                .map((datePart, i) => {
                    return {
                        datePartTitle: datePart,
                        datePartValue: Number(datePartsValue[i])
                    };
                })
                .reduce((formattedDateString, datePart) => {
                    switch (datePart.datePartTitle) {
                        case 'YYYY':
                            formattedDateString += datePart.datePartValue;
                            break;
                        case 'MM':
                            formattedDateString += `-${datePart.datePartValue}`;
                            break;
                        case 'DD':
                            formattedDateString += `-${datePart.datePartValue}`;
                            break;
                        case 'HH':
                            formattedDateString += ` ${datePart.datePartValue}:00:00`;
                            break;
                        default:
                            break;
                    }
                    return formattedDateString;
                }, '');
            return new Date(formattedDateString);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}

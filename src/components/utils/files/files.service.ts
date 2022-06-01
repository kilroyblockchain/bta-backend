import { BadRequestException, Injectable, Logger, NotFoundException, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

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

    getLogFiles(): string[] {
        const logger = new Logger(FileService.name + '-getLogFiles');
        let files: string[] = [];
        try {
            files = (fs.readdirSync(join(process.cwd(), 'logs')) ?? []).reduce((logsDetailList, log) => {
                if (log.includes('application-') && !log.includes('.gz')) {
                    logsDetailList.push(log);
                }
                return logsDetailList;
            }, []);
            return files;
        } catch (err) {
            logger.error(err);
            throw new NotFoundException('Logs file not found');
        }
    }

    getLogFile(fileName: string): StreamableFile {
        const logger = new Logger(FileService.name + '-getLogFile');
        try {
            const streamFile = fs.createReadStream(join(process.cwd(), `logs/${fileName}`));
            return new StreamableFile(streamFile);
        } catch (err) {
            logger.error(err);
            throw new BadRequestException('Logs file not found');
        }
    }
}

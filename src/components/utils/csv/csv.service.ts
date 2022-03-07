import { Injectable } from '@nestjs/common';
import * as fastCSV from 'fast-csv';
import * as fs from 'fs';
import { getCurrentTimeStampString } from 'src/@core/utils/common.utils';
import { CreateCSVResponse } from './interfaces/create-csv-response.interface';
import { ICSVData } from './interfaces/csv-data.interface';

@Injectable()
export class CSVService {
    createCSV(data: ICSVData<string>[], fileName: string, filepath?: string): CreateCSVResponse {
        fileName = fileName.trim().replace(' ', '_');
        fileName = fileName + Date.now();
        const savingPath = filepath ? `/uploads/${filepath}/` : '/uploads/csv/';
        const csvPath = process.cwd() + savingPath;
        if (!fs.existsSync(csvPath)) {
            fs.mkdirSync(csvPath);
        }
        const fullPath = `${csvPath}${fileName.includes('.csv') ? fileName : fileName + '.csv'}`;
        const ws = fs.createWriteStream(fullPath);
        const resFastCSV = fastCSV.write(data, { headers: true }).pipe(ws);
        return {
            resFastCSV,
            fullPath
        };
    }

    createLog(data: string, fileName: string, filepath?: string, importedDate = new Date()): { fullPath: string; fileName: string } {
        fileName = fileName.trim().replace(' ', '-');
        fileName = fileName ? fileName + getCurrentTimeStampString(importedDate) : getCurrentTimeStampString(importedDate);
        const savingPath = filepath ? `/uploads/${filepath}/` : '/uploads/log/';
        const logFilePath = process.cwd() + savingPath;
        if (!fs.existsSync(logFilePath)) {
            fs.mkdirSync(logFilePath);
        }
        const fullPath = `${logFilePath}${fileName.includes('.log') ? fileName : fileName + '.log'}`;
        const ws = fs.createWriteStream(fullPath);
        ws.write(data);
        return {
            fullPath,
            fileName: fileName.includes('.log') ? fileName : fileName + '.log'
        };
    }

    appendToLogFile(fileName: string, appendContent: string): void {
        fs.appendFileSync(process.cwd() + '/uploads/csv-import-log/' + fileName, '\n' + appendContent);
    }

    appendToLogFileFromPath(fileName: string, appendContent: string, path?: string): void {
        fs.appendFileSync(process.cwd() + (path ? path + fileName : '/uploads/quarantine-import/' + fileName), '\n' + appendContent);
    }
}

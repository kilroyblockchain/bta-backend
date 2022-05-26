import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileService {
    createJSONFile(jsonObject: JSON, fileName: string, filepath?: string): string {
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
    }

    cleanTempDir(): void {
        try {
            const files = fs.readdirSync(process.cwd() + '/uploads/temp/');
            files.forEach((file) => {
                if (new Date().getTime() > Number(file.split('-')[0]) + 2 * 60 * 60 * 1000) {
                    fs.unlinkSync(process.cwd() + '/uploads/temp/' + file);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }
}

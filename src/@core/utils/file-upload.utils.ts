import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';

export const imageFileFilter = (req, file, callback): void => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST), false);
    }
    callback(null, true);
};

export const editFileName = (req, file, callback): void => {
    const fileExtName = extname(file.originalname);
    const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 32).toString(32))
        .join('');
    callback(null, `${randomName}${fileExtName}`);
};

export const docsFileFilter = (req, file, callback): void => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|doc|docx|xls|xlsx|csv|pptx|pptm|ppt)$/)) {
        return callback(new HttpException('Unsupported document type!', HttpStatus.BAD_REQUEST), false);
    }
    callback(null, true);
};

export const createMonitoringDocDestinationFolder = (req, file, cb): void => {
    const path = process.cwd() + `/uploads/version-reports`;

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }

    cb(null, path);
};

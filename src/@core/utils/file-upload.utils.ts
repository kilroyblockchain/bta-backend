import { basename, extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import { getCurrentTimeStampString } from './common.utils';

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST), false);
    }
    callback(null, true);
};

export const documentFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|csv)$/)) {
        return callback(new HttpException('Unsupported document type!', HttpStatus.BAD_REQUEST), false);
    }
    callback(null, true);
};

export const getAssessmentUploadsDestination = (req, file, callback) => {
    const path = process.cwd() + `/uploads/assessment/`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    callback(null, `./uploads/assessment/`);
};

export const getTraineeAssessmentUploadsDestination = (req, file, callback) => {
    const path = process.cwd() + `/uploads/trainee-assessment/`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    callback(null, `./uploads/trainee-assessment/`);
};

export const importedFileDestination = (req, file, callback) => {
    const path = process.cwd() + `/uploads/imported-file/`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    callback(null, `./uploads/imported-file`);
};

export const editFileName = (req, file, callback) => {
    const fileExtName = extname(file.originalname);
    const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 32).toString(32))
        .join('');
    callback(null, `${randomName}${fileExtName}`);
};

export const editOriginalFileName = (req, file, callback) => {
    const fileExtName = extname(file.originalname);
    const fileOriginalName = basename(file.originalname, fileExtName).replace(/ /g, '_');
    const randomName = Array(8)
        .fill(null)
        .map(() => Math.round(Math.random() * 8).toString(8))
        .join('');
    callback(null, `${fileOriginalName}-${randomName}${fileExtName}`);
};

export const editFileNameForCsvImport = (req, file, callback) => {
    const fileExtName = extname(file.originalname);
    callback(null, `import-${getCurrentTimeStampString()}${fileExtName}`);
};

export const getProjectZipFileDestination = (req, file, callback) => {
    let path;
    if (file.fieldname === 'dataSet') {
        path = process.cwd() + `/uploads/dataset`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        callback(null, `./uploads/dataset`);
    }
    if (file.fieldname === 'model') {
        path = process.cwd() + `/uploads/model`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        callback(null, `./uploads/model`);
    }
};

export const getLeaveSignatureDestination = (req, file, callback) => {
    const path = process.cwd() + `/uploads/signature/`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    callback(null, `./uploads/signature`);
};

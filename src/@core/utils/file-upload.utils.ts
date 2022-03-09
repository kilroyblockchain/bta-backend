import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST), false);
    }
    callback(null, true);
};

export const editFileName = (req, file, callback) => {
    const fileExtName = extname(file.originalname);
    const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 32).toString(32))
        .join('');
    callback(null, `${randomName}${fileExtName}`);
};

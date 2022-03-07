import { WriteStream } from 'fs';

export interface CreateCSVResponse {
    resFastCSV: WriteStream;
    fullPath: string;
}

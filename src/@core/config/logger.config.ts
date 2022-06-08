import { format } from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import 'dotenv/config';
import { myFormat } from '../utils/logger.utils';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';

const { combine } = format;

export const consoleTransportOptions: ConsoleTransportOptions = {
    format: combine(format.timestamp(), format.ms(), nestWinstonModuleUtilities.format.nestLike('MyApp', { prettyPrint: true }))
};

export const dailyRotateFileTransportOptions: DailyRotateFile.DailyRotateFileTransportOptions = {
    filename: 'logs/application-%DATE%.log',
    datePattern: process.env.APP_LOG_DATE_PATTERN ?? 'YYYY-MM-DD',
    zippedArchive: process.env.APP_LOG_ZIPPED_ARCHIVE && process.env.APP_LOG_ZIPPED_ARCHIVE?.toLowerCase() === 'true',
    maxSize: process.env.APP_LOG_MAX_SIZE ?? '20m',
    maxFiles: process.env.APP_LOG_MAX_FILES ?? '14d',
    format: combine(format.timestamp(), format.ms(), myFormat)
};

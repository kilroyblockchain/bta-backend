import { format } from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { myFormat } from '../utils/logger.utils';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';

const { combine } = format;

export const consoleTransportOptions: ConsoleTransportOptions = {
    format: combine(format.timestamp(), format.ms(), nestWinstonModuleUtilities.format.nestLike('MyApp', { prettyPrint: true }))
};

export const dailyRotateFileTransportOptions: DailyRotateFile.DailyRotateFileTransportOptions = {
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: combine(format.timestamp(), format.ms(), myFormat)
};

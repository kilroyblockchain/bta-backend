import { format } from 'winston';

const appName = 'KBC-APP';
const { printf } = format;

export const myFormat = printf(({ level, message, ms, context, timestamp }) => {
    return `[${appName}] ` + `${level.charAt(0).toUpperCase() + level.slice(1)}\t` + ('undefined' !== typeof timestamp ? `${timestamp} ` : '') + ('undefined' !== typeof context ? `[${context}] ` : '') + `${message} - ` + ('undefined' !== typeof ms ? ` ${ms}` : '');
});

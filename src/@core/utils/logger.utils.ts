import { inspect } from 'util';
import { format } from 'winston';
import safeStringify from 'fast-safe-stringify';

const appName = 'KBC-APP';
const { printf } = format;

export const myFormat = printf(({ level, message, ms, context, timestamp, ...meta }) => {
    const stringifiedMeta = safeStringify(meta);
    const formattedMeta = inspect(JSON.parse(stringifiedMeta), { colors: false, depth: null });

    return `[${appName}] ` + `${level.charAt(0).toUpperCase() + level.slice(1)}\t` + ('undefined' !== typeof timestamp ? `${timestamp} ` : '') + ('undefined' !== typeof context ? `[${context}] ` : '') + `${message} - ` + `${formattedMeta}` + ('undefined' !== typeof ms ? ` ${ms}` : '');
});

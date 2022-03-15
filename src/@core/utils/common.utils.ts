import { Request } from 'express';

export const getHourMinuteDiff = (futureDate: Date, earlyDate = new Date()): string => {
    const date = new Date(futureDate);
    const diff = date.getTime() - earlyDate.getTime();

    const hours = Math.floor(diff / 1000 / 60 / 60).toFixed(0);
    const minutes = (Math.floor(diff / 1000 / 60) % 60).toFixed(0);
    const seconds = (Math.floor(diff / 1000) % 60).toFixed(0);

    const str = `${hours} hr ${minutes} min ${seconds} sec`;
    return str;
};

export const getCurrentTimeStampString = (date = new Date()): string => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${date.getMilliseconds()}`;
};

export const getClientTimezoneId = (req: Request): string | Array<string> => {
    return req.headers.timezoneid ? req.headers.timezoneid : String(Intl.DateTimeFormat().resolvedOptions().timeZone);
};

export const getArraysComplement = (largeArray: Array<string>, smallArray: Array<string>): Array<string> => {
    return largeArray.filter((element) => {
        return smallArray.indexOf(element.toString()) === -1;
    });
};

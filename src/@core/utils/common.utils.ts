import { Logger } from '@nestjs/common';
import { Request } from 'express';
import * as CryptoJS from 'crypto-js';

const ENCRYPT_SECRET_KEY = process.env.ENCRYPT_SECRET_KEY;

export const getHourMinuteDiff = (futureDate: Date, earlyDate = new Date()) => {
    const date = new Date(futureDate);
    const diff = date.getTime() - earlyDate.getTime();

    const hours = Math.floor(diff / 1000 / 60 / 60).toFixed(0);
    const minutes = (Math.floor(diff / 1000 / 60) % 60).toFixed(0);
    const seconds = (Math.floor(diff / 1000) % 60).toFixed(0);

    const str = `${hours} hr ${minutes} min ${seconds} sec`;
    return str;
};

export const getTimeWithZeroHourMinSec = (date?: Date): number => {
    if (date) {
        return date.setHours(0, 0, 0, 0);
    }
    return new Date().setHours(0, 0, 0, 0);
};

export const getTimeWithLastHourMinSec = (date?: Date): number => {
    if (date) {
        return date.setHours(23, 59, 59, 59);
    }
    return new Date().setHours(23, 59, 59, 59);
};

export const addDaysToDate = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(new Date(date).getDate() + days);
    return result;
};

export const getDaysDifferenceBetweenTwoDates = (fromDate: Date, toDate: Date): number => {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    const utc2 = Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
    return Math.floor((utc2 - utc1) / MS_PER_DAY);
};

export const prepareLogMessage = (logType: string, importedFileName: string, logMessage: Array<any>): string => {
    return Logger.getTimestamp() + ` ${logType} : ${importedFileName} - ${prepareMessageFromConstant(logMessage)}`;
};

export const prepareMessageFromConstant = (constant: Array<any>): string => {
    if (constant.length === 1) {
        return constant[0];
    }
    if (constant.length === 2) {
        let finalMessage: string = constant[0];
        const variableObject = constant[1];
        for (const key in variableObject) {
            if (finalMessage.includes(`{{${key}}}`)) {
                finalMessage = finalMessage.replace(new RegExp(`{{${key}}}`, 'g'), variableObject[key]);
            }
        }
        return finalMessage;
    }
};

export const generateRegex = (input: string): RegExp => {
    let regexString = '';
    for (let index = 0; index < input.length; index++) {
        if (index < 2) {
            regexString = regexString + input[index];
        } else {
            regexString = regexString + (input[index] + '*');
        }
    }
    return new RegExp(regexString, 'gi');
};

export const getCurrentTimeStampString = (date = new Date()): string => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${date.getMilliseconds()}`;
};

export const validateEmail = (email: string): boolean => {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
};

export const getClientTimezoneId = (req: Request): string | Array<string> => {
    return req.headers.timezoneid ? req.headers.timezoneid : String(Intl.DateTimeFormat().resolvedOptions().timeZone);
};

export const convertTimezone = (date: Date, tzString: string): Date => {
    return new Date(
        (typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {
            timeZone: tzString
        })
    );
};

export const toIsoString = (date: Date): string => {
    const timeZoneOffset = -date.getTimezoneOffset();
    const dif = timeZoneOffset >= 0 ? '+' : '-';
    const pad = (num: number) => {
        const norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
    };
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + dif + pad(timeZoneOffset / 60) + ':' + pad(timeZoneOffset % 60);
};

export const getArraysComplement = (largeArray: Array<string>, smallArray: Array<string>): Array<string> => {
    return largeArray.filter((element) => {
        return smallArray.indexOf(element.toString()) === -1;
    });
};

export const getRandomString = (length: number): string => {
    return Math.random().toString(16).substr(2, length);
};

export const getUniquePhoneNumber = (phone: string, stringLength = 2): string => {
    return phone + getRandomString(stringLength) + Math.floor(100 + Math.random() * 900) + new Date().valueOf();
};

/**
 * Function to get list of dates fr0m to toDate
 * @param {Date} fromDate - From Date
 * @param {Date} toDate - To Date
 * @param {number} timezoneOffSet - Time offset in milisecond
 * @param {string} timezoneId - Timezone Id i.e. Asia/Kathmandu
 * @returns
 */
export const getDateList = (fromDate: Date, toDate: Date, timezoneOffSet: number, timezoneId: string): Array<{ localDateString: string; isoDateWithOffSet: Date }> => {
    const currentDate = fromDate;
    const dateArray = [];
    while (currentDate < toDate) {
        dateArray.push({
            localDateString: new Date(new Date(currentDate).getTime() - timezoneOffSet).toLocaleDateString('en-US', { timeZone: timezoneId }),
            isoDateWithOffSet: new Date(new Date(currentDate).getTime() - timezoneOffSet)
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray ?? [];
};

export const encryptData = (data: string): string => {
    try {
        return CryptoJS.AES.encrypt(data, ENCRYPT_SECRET_KEY).toString();
    } catch (e) {
        console.log(e);
    }
};

export const decryptData = (data: string): string => {
    try {
        if (data) {
            const bytes = CryptoJS.AES.decrypt(data, ENCRYPT_SECRET_KEY);
            if (bytes.toString()) {
                return bytes.toString(CryptoJS.enc.Utf8);
            }
        }
        return data;
    } catch (e) {
        console.log(e);
    }
};

export const addADay = (date: Date): Date => {
    return new Date(date.setDate(date.getDate() + 1));
};

export const getFormattedDate = (date = new Date()): string => {
    return (date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '/' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) + '/' + date.getFullYear();
};

/**
 * Function to compare values in array
 * @param {any} firstObj - Array Element
 * @param {any} secondObj - Array Element
 * @param {string} propName - Property name of object
 * @param {number} sortType - 1 for asc, -1 for desc
 * @returns {number} 1 sort secondObj before firstObj, -1 sort firstObj before secondObj, 0 keep original order
 */
export const compareFunc = (firstObj: any, secondObj: any, propName: string = null, sortType = 1): number => {
    if (!propName) {
        if (firstObj > secondObj) {
            return sortType;
        } else if (firstObj < secondObj) {
            return -sortType;
        } else {
            return 0;
        }
    } else {
        if (firstObj[propName] > secondObj[propName]) {
            return sortType;
        } else if (firstObj[propName] < secondObj[propName]) {
            return -sortType;
        } else {
            return 0;
        }
    }
};

/**
 * A function to equate property of two object
 * @param {[key: string]: any} object1 - First Object to equate with second object
 * @param {[key: string]: any} object2 - Second Object to equate with first object
 * @param {string[]} propertyNames - Property Names to have equal value in object1 and object2
 * @returns {boolean} - Returns true when the value of properties in both object are same otherwise false
 */
export const equateProperty = (object1: { [key: string]: any }, object2: { [key: string]: any }, propertyNames: string[]): boolean => {
    for (const propertyName of propertyNames) {
        if (object2[propertyName]?.toString() && !(object1[propertyName]?.toString() === object2[propertyName]?.toString())) {
            return false;
        }
    }
    return true;
};

export const getKeyByValue = (object: any, value: string) => {
    return Object.keys(object).find((key) => object[key] === value);
};

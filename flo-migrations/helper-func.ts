/**
 * Returns MongoURI which is used to connect mongodb
 * @param {string} hostURI - Mongo URL. Ex: mongodb://localhost:27017
 * @param {string} dbName  - Database name. Ex: flo
 * @param {string} host - Host of mongodb. Ex: localhost
 * @param {string} userName - Username of mongodb. Ex: api
 * @param {string} password - Password of mongodb. Ex: flopass
 * @param {string} authSource - Authsource to which authentication is done. Ex: 'admin'
 * @returns
 */
export const buildMongoURI = (hostURI: string, dbName: string, host: string, userName: string, password: string, authSource = 'admin'): string => {
    if (userName) {
        return hostURI.replace(host, `${userName}:${password}@${host}`) + `/${dbName}?authSource=${authSource}`;
    } else {
        return `${hostURI}/${dbName}`;
    }
};

export const consoleLogWrapper = (message: string): void => {
    console.log('**************************************************');
    console.log(message);
    console.log('**************************************************');
};

export class BcTransactionInfoDto {
    key: string;
    salt: string;
    channelName: string;

    constructor(key: string, salt: string, channelName: string) {
        this.key = key;
        this.salt = salt;
        this.channelName = channelName;
    }
}

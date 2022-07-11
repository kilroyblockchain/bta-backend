export class BcAuthenticationDto {
    basicAuthorization: string;
    organizationName: string;
    channelName: string;
    bcKey: string;
    salt: string;
    nodeUrl: string;
    bcConnectionApi: string;

    constructor(basicAuthorization: string, organizationName: string, channelName: string, bcKey: string, salt: string, nodeUrl: string, bcConnectionApi: string) {
        this.basicAuthorization = basicAuthorization;
        this.organizationName = organizationName;
        this.channelName = channelName;
        this.bcKey = bcKey;
        this.salt = salt;
        this.nodeUrl = nodeUrl;
        this.bcConnectionApi = bcConnectionApi;
    }
}

export class BcUserAuthenticationDto {
    key: string;
    salt: string;

    constructor(key: string, salt: string) {
        this.key = key;
        this.salt = salt;
    }
}

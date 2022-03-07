export class BcUserDto {
    enrollmentId: string;

    enrollmentSecret: string;

    company: any;

    staffingId: string;

    loggedInUserId: string;

    constructor(enrollmentId?: string, enrollmentSecret?: string) {
        this.enrollmentId = enrollmentId;
        this.enrollmentSecret = enrollmentSecret;
    }
}

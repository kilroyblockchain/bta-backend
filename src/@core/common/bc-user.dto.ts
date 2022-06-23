import { ICompany } from 'src/components/app-user/user/interfaces/user.interface';

export class BcUserDto {
    enrollmentId: string;

    enrollmentSecret: string;

    company: ICompany;

    staffingId: string;

    loggedInUserId: string;

    constructor(enrollmentId?: string, enrollmentSecret?: string) {
        this.enrollmentId = enrollmentId;
        this.enrollmentSecret = enrollmentSecret;
    }
}

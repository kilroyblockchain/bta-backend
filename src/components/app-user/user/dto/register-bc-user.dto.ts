import { IsString } from 'class-validator';

export class RegisterBcUserDto {
    @IsString()
    userId: string;
    @IsString()
    email: string;

    constructor(userId: string, email: string) {
        this.userId = userId;
        this.email = email;
    }
}

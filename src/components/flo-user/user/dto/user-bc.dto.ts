import { IsEmail, IsNotEmpty, IsString, IsArray } from 'class-validator';

export class UserBcDto {
    @IsNotEmpty()
    @IsString()
    _id: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    zipCode: string;

    @IsArray()
    company: string[];

    @IsArray()
    skill: string[];

    @IsArray()
    language: string[];

    @IsArray()
    education: string[];

    @IsArray()
    experience: string[];
}

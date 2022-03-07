import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EducationBcDto {
    @IsNotEmpty()
    @IsString()
    _id: string;

    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    school: string;

    @IsNotEmpty()
    @IsString()
    degree: string;

    @IsNotEmpty()
    @IsString()
    fieldOfStudy: string;

    @IsOptional()
    grade: string;

    @IsNumber()
    startYear: number;

    @IsOptional()
    endYear: number;

    status: boolean;

    @IsNotEmpty()
    @IsString()
    createdAt: string;

    @IsNotEmpty()
    @IsString()
    updatedAt: string;
}

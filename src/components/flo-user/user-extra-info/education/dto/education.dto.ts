import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EducationDto {
    userId: string;
    @ApiProperty({
        example: 'ABC School',
        description: 'School/Instituion Name'
    })
    @IsNotEmpty()
    @IsString()
    readonly school: string;

    @ApiProperty({
        example: 'Bachelor',
        description: 'Level of Education'
    })
    @IsNotEmpty()
    @IsString()
    readonly degree: string;

    @ApiProperty({
        example: 'Information Technology',
        description: 'Field of Study'
    })
    @IsNotEmpty()
    @IsString()
    readonly fieldOfStudy: string;

    @ApiProperty({
        example: '3.0 CGPA',
        description: 'Grade'
    })
    @IsOptional()
    readonly grade: string;

    @ApiProperty({
        example: 2001,
        description: 'Start Year'
    })
    @IsNotEmpty()
    @IsNumber()
    readonly startYear: number;

    @ApiProperty({
        example: 2005,
        description: 'End Year'
    })
    @IsOptional()
    readonly endYear: number;

    status: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
    @ApiProperty({
        example: 'Blockchain',
        description: 'Project Name',
        format: 'string',
        uniqueItems: true,
        required: true
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        example: 'This is blockchain project',
        description: 'Description of project',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    details: string;

    @ApiProperty({
        example: ['5faa30d918352f2e4c4f0b18'],
        description: 'User Id',
        format: 'array'
    })
    @IsNotEmpty()
    @IsArray()
    members: string[];

    @ApiProperty({
        example: 'Finance',
        description: 'This describe what type of project it is',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    domain: string;

    @ApiProperty({
        example: 'purpose',
        description: 'Purpose of the project',
        format: 'string'
    })
    @IsOptional()
    @IsString()
    purpose: string;
}

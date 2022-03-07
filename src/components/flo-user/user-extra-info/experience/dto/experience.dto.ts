import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ExperienceDto {
    userId: string;
    @ApiProperty({
        example: 'Java Programmer',
        description: 'Job Title'
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @ApiProperty({
        example: 'Trainee',
        description: 'Type of Employment'
    })
    @IsNotEmpty()
    @IsString()
    readonly employmentType: string;

    @ApiProperty({
        example: 'Black Knight Financial Services',
        description: 'Company'
    })
    @IsNotEmpty()
    @IsString()
    readonly company: string;

    @ApiProperty({
        example: 'Jacksonsville, FL',
        description: 'Location'
    })
    @IsNotEmpty()
    @IsString()
    readonly location: string;

    @ApiProperty({
        example: '2018-01-18',
        description: 'Start Date',
        type: 'string',
        format: 'date'
    })
    @IsNotEmpty()
    @IsString()
    readonly startDate: Date;

    @ApiProperty({
        example: '2020-01-18',
        description: 'End Date',
        type: 'string',
        format: 'date'
    })
    @IsOptional()
    readonly endDate: Date;

    status: boolean;
}

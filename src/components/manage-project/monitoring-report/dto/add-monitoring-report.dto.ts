import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddReportDto {
    @ApiProperty({
        example: 'New Issue',
        description: 'Subject or title of the report',
        maxLength: 40,
        minLength: 2,
        required: true
    })
    @IsNotEmpty()
    @IsString()
    subject: string;

    @ApiProperty({
        example: 'New Traffic image is not working as per expectation',
        description: 'Details of the report',
        maxLength: 255,
        minLength: 2,
        required: true
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @ApiProperty({
        type: ['file'],
        required: false,
        maxItems: 5,
        description: 'This is document of monitoring reports'
    })
    docs: string[];
}

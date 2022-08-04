import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddReportDto {
    @ApiProperty({
        example: 'New Issue',
        description: 'Subject or title of the report',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    subject: string;

    @ApiProperty({
        example: 'New Traffic image is not working as per expectation',
        description: 'Details of the report',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        example: 'http://monitoring-tools.com',
        description: 'Link of tool which is used for monitoring',
        format: 'string'
    })
    @IsOptional()
    @IsString()
    monitoringToolLink: string;

    @IsOptional()
    @ApiProperty({
        type: ['file'],
        required: false,
        maxItems: 5,
        description: 'This is document of monitoring reports'
    })
    docs: Array<Express.Multer.File>;

    @ApiProperty({
        example: 'HTTP restriction',
        description: 'Status for model on monitoring reports',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    status: string;

    @IsOptional()
    @IsString()
    otherStatus: string;
}

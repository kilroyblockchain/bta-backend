import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BlogDto {
    @ApiProperty({
        example: 'Covid-19 Symptoms',
        description: 'Blog Title',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @ApiProperty({
        example: 'covid-19-symptoms',
        description: 'Blog URL',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly url: string;

    @ApiProperty({
        example: 'Blog content',
        description: 'Blog Content',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly content: string;

    @ApiProperty({
        example: true,
        description: 'Blog Content status'
    })
    @IsOptional()
    readonly status?: boolean;
}

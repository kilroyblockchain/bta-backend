import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExperimentAddDto {
    @ApiProperty({
        example: 'V1'
    })
    @IsNotEmpty()
    @IsString()
    projectVersion: string;

    @ApiProperty({
        example: 'V1'
    })
    @IsNotEmpty()
    @IsString()
    experimentVersion: string;

    @ApiProperty({
        example: 'V1'
    })
    @IsNotEmpty()
    @IsString()
    codeVersion: string;

    @ApiProperty({
        example: 'http://abc.com'
    })
    @IsNotEmpty()
    @IsString()
    codeRepoLink: string;

    @ApiProperty({
        example: 'V1'
    })
    @IsNotEmpty()
    @IsString()
    notebookVersion: string;

    @ApiProperty({
        example: '{"test": "test"}}'
    })
    @IsNotEmpty()
    @IsString()
    model: string;

    @ApiProperty({
        example: 'http://abc.com'
    })
    @IsNotEmpty()
    @IsString()
    trainDataSetLink: string;

    @ApiProperty({
        example: 'http://abc.com'
    })
    @IsNotEmpty()
    @IsString()
    testDataSetLink: string;

    @ApiProperty({
        example: 'framework'
    })
    @IsNotEmpty()
    @IsString()
    framework: string;

    @ApiProperty({
        example: 'V1'
    })
    @IsNotEmpty()
    @IsString()
    frameworkVersion: string;

    @ApiProperty({
        example: 'http://abc.com'
    })
    @IsNotEmpty()
    @IsString()
    logFileLink: string;

    @ApiProperty({
        example: 'http://abc.com'
    })
    @IsNotEmpty()
    @IsString()
    parameters: string;

    @ApiProperty({
        example: '{"test": "test"}}'
    })
    @IsNotEmpty()
    @IsString()
    performanceMetrics: string;

    status: boolean;

    @ApiProperty({
        example: '5faa30d918352f2e4c4f0b18'
    })
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty({
        example: '5faa30d918352f2e4c4f0b18'
    })
    @IsNotEmpty()
    @IsString()
    projectId: string;
}

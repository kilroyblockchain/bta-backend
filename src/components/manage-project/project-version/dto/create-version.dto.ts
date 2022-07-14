import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddVersionDto {
    @ApiProperty({
        example: 'AI Model V1',
        description: 'Name of version',
        format: 'string',
        uniqueItems: true,
        required: true
    })
    @IsNotEmpty()
    @IsString()
    versionName: string;

    @ApiProperty({
        example: 'http://ml.oracle.com/',
        description: 'URL of log file',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    logFilePath: string;

    @ApiProperty({
        example: 'V1',
        description: 'Version of log file',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    logFileVersion: string;

    @ApiProperty({
        example: 'http://ml.oracle.com/model/',
        description: 'Version model URL',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    versionModel: string;

    @ApiProperty({
        example: '1.7',
        description: 'Version of notebook',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    noteBookVersion: string;

    @ApiProperty({
        example: 'http://ml.oracle.com/traindataaset/',
        description: 'URL of train data sets',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    trainDataSets: string;

    @ApiProperty({
        example: 'http://ml.oracle.com/testdataset/',
        description: 'URL of test data sets',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    testDataSets: string;

    @ApiProperty({
        example: 'http://ml.oracle.com/aiModel/',
        description: 'URL of aiModel',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    aiModel: string;

    @ApiProperty({
        example: 'http://git.com/michael/project-name/',
        description: 'URL of code repository',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    codeRepo: string;

    @ApiProperty({
        example: 'V1',
        description: 'Version of code',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    codeVersion: string;

    @ApiProperty({
        example: 'Please follow this instructions while testing the model',
        description: 'Version comment',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    comment: string;
}

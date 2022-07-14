import { ApiProperty } from '@nestjs/swagger';
import { VersionStatus } from '../enum/version-status.enum';

export class BCVersionDataResponseDto {
    @ApiProperty({
        example: '62c93bd2e6bd374d4fa8fbc7',
        description: 'Version Id',
        format: 'string'
    })
    id: string;

    @ApiProperty({
        example: 'AI Model V1',
        description: 'Name of version',
        format: 'string'
    })
    versionName: string;

    @ApiProperty({
        example: 'http://ml.oracle.com/',
        description: 'URL of log file',
        format: 'string'
    })
    logFilePath: string;

    @ApiProperty({
        example: 'V1',
        description: 'Version of log file',
        format: 'string'
    })
    logFileVersion: string;

    @ApiProperty({
        example: 'e202b86e0e58026994616fa5957a3a199ffc7d7b2b421365c30ed1b238b2b252',
        description: 'Version of log file Bc Hash',
        format: 'string'
    })
    logFileBCHash: string;

    @ApiProperty({
        example: 'http://ml.oracle.com/model/',
        description: 'Version model URL',
        format: 'string'
    })
    versionModel: string;

    @ApiProperty({
        example: '1.7',
        description: 'Version of notebook',
        format: 'string'
    })
    noteBookVersion: string;

    @ApiProperty({
        example: 'http://ml.oracle.com/traindataaset/',
        description: 'URL of train data sets',
        format: 'string'
    })
    trainDataSets: string;

    @ApiProperty({
        example: '9769eb33a016bad956c0793d1d00463321d3f23e9c06660e181c5cf441e82c8f',
        description: 'Version of log file Bc Hash',
        format: 'string'
    })
    trainDatasetBCHash: string;

    @ApiProperty({
        example: 'http://ml.oracle.com/testdataset/',
        description: 'URL of test data sets',
        format: 'string'
    })
    testDataSets: string;

    @ApiProperty({
        example: 'dbd3b5501f5d35f6665ab27206a9febfb58e61b33ae7073ae49dbeb01d566632',
        description: 'Version of log file Bc Hash',
        format: 'string'
    })
    testDatasetBCHash: string;

    @ApiProperty({
        example: 'http://ml.oracle.com/aiModel/',
        description: 'URL of aiModel',
        format: 'string'
    })
    aiModel: string;

    @ApiProperty({
        example: 'http://git.com/michael/project-name/',
        description: 'URL of code repository',
        format: 'string'
    })
    codeRepo: string;

    @ApiProperty({
        example: 'V1',
        description: 'Version of code',
        format: 'string'
    })
    codeVersion: string;

    @ApiProperty({
        example: 'Please follow this instructions while testing the model',
        description: 'Version comment',
        format: 'string'
    })
    comment: string;

    @ApiProperty({
        example: true,
        description: 'Status of version',
        format: 'boolean'
    })
    status: boolean;

    @ApiProperty({
        example: VersionStatus.PENDING,
        description: 'Status of version',
        format: 'boolean'
    })
    versionStatus: VersionStatus;

    @ApiProperty({
        example: 'Sales prediction',
        description: 'Name of project where version is added',
        format: 'string'
    })
    project: string;

    @ApiProperty({
        example: 'John',
        description: 'user name who added the project version',
        format: 'string'
    })
    entryUser: string;

    @ApiProperty({
        example: new Date(),
        description: 'Project version created date in Blockchain'
    })
    recordDate: Date;
}

export class BCVersionHistoryResponseDto {
    @ApiProperty({
        example: '92af9443a6ba663309318647c88f4931cad444cf4cff90ecfedb15957b856c76',
        description: 'blockchain transaction Id',
        format: 'string'
    })
    txId: string;

    @ApiProperty({
        example: false,
        description: 'Name of version',
        format: 'boolean'
    })
    isDeleted: string;

    @ApiProperty({
        example: BCVersionDataResponseDto,
        description: 'Data of  project version',
        format: 'object'
    })
    projectVersion: BCVersionDataResponseDto;
}

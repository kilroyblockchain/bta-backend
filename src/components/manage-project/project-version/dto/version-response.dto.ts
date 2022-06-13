import { ApiProperty } from '@nestjs/swagger';
import { IUser } from 'src/components/flo-user/user/interfaces/user.interface';
import { IProject } from 'src/components/manage-project/project/interfaces/project.interface';
import { VersionStatus } from '../enum/version-status.enum';

export class VersionResponseDto {
    @ApiProperty({
        example: '629f952b7dcf360f4ed86976',
        description: 'Name of version',
        format: 'string'
    })
    _id: string;

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
        example: 'http://ml.oracle.com/testdataset/',
        description: 'URL of test data sets',
        format: 'string'
    })
    testDataSets: string;

    @ApiProperty({
        example: 'http://ml.oracle.com/artificats/',
        description: 'URL of artifacts',
        format: 'string'
    })
    artifacts: string;

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
        example: '60e6fe33d27e2133c485513b',
        description: 'Id of user who create the project',
        format: 'string'
    })
    createdBy: string;

    @ApiProperty({
        example: '60e6fe33d27e2133c485513b',
        description: 'Id of project where version is added',
        format: 'string'
    })
    project: string;

    @ApiProperty({
        example: new Date(),
        description: 'Project version added created date'
    })
    createdAt: Date;

    @ApiProperty({
        example: new Date(),
        description: 'Project version updated date'
    })
    updatedAt: Date;
}

export class VersionInfoResponseDto {
    @ApiProperty({
        example: '629f952b7dcf360f4ed86976',
        description: 'Name of version',
        format: 'string'
    })
    _id: string;

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
        example: 'http://ml.oracle.com/testdataset/',
        description: 'URL of test data sets',
        format: 'string'
    })
    testDataSets: string;

    @ApiProperty({
        example: 'http://ml.oracle.com/artificats/',
        description: 'URL of artifacts',
        format: 'string'
    })
    artifacts: string;

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
        example: {
            _id: '629fa9ef0aca7ba9698371ef',
            firstName: 'Suyog',
            lasName: 'Khanal',
            email: 'suyog@kilroyblockchain.com'
        },

        description: 'Version Creator user details',
        format: 'object'
    })
    createdBy: IUser;

    @ApiProperty({
        example: {
            _id: '629f900d986049e2d9e80476',
            name: 'Blockchain',
            details: 'This is blockchain project',
            domain: 'Finance'
        },

        description: 'Version Creator user details',
        format: 'object'
    })
    project: IProject;

    @ApiProperty({
        example: new Date(),
        description: 'Project version added created date'
    })
    createdAt: Date;

    @ApiProperty({
        example: new Date(),
        description: 'Project version updated date'
    })
    updatedAt: Date;
}
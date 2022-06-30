import { ApiProperty } from '@nestjs/swagger';
import { IUser } from 'src/components/app-user/user/interfaces/user.interface';
import { VersionStatus } from '../../project-version/enum/version-status.enum';
import { IReviewDocs } from '../interfaces/model-review.interface';

export class ModelReviewResponseDto {
    @ApiProperty({
        example: '629f952b7dcf360f4ed86976',
        description: 'Id of the model review',
        format: 'string'
    })
    _id: string;

    @ApiProperty({
        example: 'Reviewing the submitted model',
        description: 'Comment for review the model',
        format: 'string'
    })
    comment: string;

    @ApiProperty({
        example: 'Reviewing',
        description: 'Reviewed status of model',
        format: 'string'
    })
    status: string;

    @ApiProperty({
        example: '3',
        description: 'Rating for the version model',
        format: 'number'
    })
    rating: number;

    @ApiProperty({
        example: [
            {
                docURL: 'version-reports/62a3271e5fdff8cd6b40d8e2-nd6mc8glgb4ekokmprkae15m34qd2sov.jpeg',
                docName: 'image1.jpeg',
                _id: '62aa0cfdbc10d93cc2bb40d3'
            }
        ],

        description: 'Reviews supporting documents',
        format: 'object'
    })
    documents: Array<IReviewDocs>;

    @ApiProperty({
        example: '60e6fe3dd27e2133c4855275',
        description: 'Id of version where reviews are added',
        format: 'string'
    })
    version: string;

    @ApiProperty({
        example: '60895385b0068f003fe9d0d9',
        description: 'Id of user who added the reviews',
        format: 'string'
    })
    createdBy: string;

    @ApiProperty({
        example: 'MLOps Engineer',
        description: 'staffing of the user who added new review'
    })
    staffing: string;

    @ApiProperty({
        example: new Date(),
        description: 'Project version added created date'
    })
    createdAt: Date;

    @ApiProperty({
        example: new Date(),
        description: 'Project updated date'
    })
    updatedAt: Date;
}

export class ModelAllReviewResponseDto {
    @ApiProperty({
        example: '629f952b7dcf360f4ed86976',
        description: 'Id of the model review',
        format: 'string'
    })
    _id: string;

    @ApiProperty({
        example: 'Reviewing the submitted model',
        description: 'Comment for review the model',
        format: 'string'
    })
    comment: string;

    @ApiProperty({
        example: 'Reviewing',
        description: 'Reviewed status of model',
        format: 'string'
    })
    status: string;

    @ApiProperty({
        example: '3',
        description: 'Rating for the version model',
        format: 'number'
    })
    rating: number;

    @ApiProperty({
        example: [
            {
                docURL: 'version-reports/62a3271e5fdff8cd6b40d8e2-nd6mc8glgb4ekokmprkae15m34qd2sov.jpeg',
                docName: 'image1.jpeg',
                _id: '62aa0cfdbc10d93cc2bb40d3'
            }
        ],

        description: 'Reviews supporting documents',
        format: 'object'
    })
    documents: Array<IReviewDocs>;

    @ApiProperty({
        example: '60e6fe3dd27e2133c4855275',
        description: 'Id of version where reviews are added',
        format: 'string'
    })
    version: string;

    @ApiProperty({
        example: {
            _id: '60895385b0068f003fe9d0d9',
            firstName: 'Suyog',
            lasName: 'Khanal'
        },
        description: 'Model review added user ',
        format: 'object'
    })
    createdBy: IUser;

    @ApiProperty({
        example: 'MLOps Engineer',
        description: 'staffing of the user who added new review'
    })
    staffing: string;

    @ApiProperty({
        example: new Date(),
        description: 'Project version added created date'
    })
    createdAt: Date;

    @ApiProperty({
        example: new Date(),
        description: 'Project updated date'
    })
    updatedAt: Date;
}

export class ReviewModelResponseDto {
    @ApiProperty({
        example: '629f952b7dcf360f4ed86976',
        description: 'Name of version',
        format: 'string'
    })
    _id: string;

    @ApiProperty({
        example: 'AI Model V1',
        description: 'Name of version',
        format: 'string',
        uniqueItems: true,
        required: true
    })
    versionName: string;

    @ApiProperty({
        example: 'http://ml.oracle.com/',
        description: 'URL of log file',
        format: 'string',
        required: true
    })
    logFilePath: string;

    @ApiProperty({
        example: 'V1',
        description: 'Version of log file',
        format: 'string',
        required: true
    })
    logFileVersion: string;

    @ApiProperty({
        example: 'http://ml.oracle.com/model/',
        description: 'Version model URL',
        format: 'string',
        required: true
    })
    versionModel: string;

    @ApiProperty({
        example: '1.7',
        description: 'Version of notebook',
        format: 'string',
        required: true
    })
    noteBookVersion: string;

    @ApiProperty({
        example: 'http://ml.oracle.com/testdataset/',
        description: 'URL of test data sets',
        format: 'string',
        required: true
    })
    testDataSets: string;

    @ApiProperty({
        example: 'http://git.com/michael/project-name/',
        description: 'URL of code repository',
        format: 'string',
        required: true
    })
    codeRepo: string;

    @ApiProperty({
        example: 'V1',
        description: 'Version of code',
        format: 'string',
        required: true
    })
    codeVersion: string;

    @ApiProperty({
        example: 'Please follow this instructions while testing the model',
        description: 'Version comment',
        format: 'string',
        required: true
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

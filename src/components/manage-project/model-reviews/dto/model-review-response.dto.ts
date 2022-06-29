import { ApiProperty } from '@nestjs/swagger';
import { IUser } from 'src/components/app-user/user/interfaces/user.interface';
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

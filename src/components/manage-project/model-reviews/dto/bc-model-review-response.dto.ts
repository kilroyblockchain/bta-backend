import { ApiProperty } from '@nestjs/swagger';
import { IReviewSupportingDocument } from '../interfaces/bc-model-review.interface';

class EntryUserBcDetailsDto {
    @ApiProperty({
        example: 'suraj+mlops2@gmail.com',
        description: 'email of entry user',
        format: 'string'
    })
    entryUser: string;

    @ApiProperty({
        example: 'AI Organization',
        description: 'organization unit of entry user',
        format: 'string'
    })
    organizationUnit: string;

    @ApiProperty({
        example: 'MLOps Engineer-1',
        description: 'staffing unit name of entry user',
        format: 'string'
    })
    staffing: string;
}

export class BcModelReviewDetailsResponseDto {
    @ApiProperty({
        example: '62d9663a211c462718272e1c',
        description: 'Version Id',
        format: 'string'
    })
    id: string;

    @ApiProperty({
        example: 'Pending',
        description: 'Status of version',
        format: 'string'
    })
    reviewStatus: string;

    @ApiProperty({
        example: '3',
        description: 'Rating for the model version',
        format: 'string'
    })
    ratings: string;

    @ApiProperty({
        example: 'Reviewing the submitted model',
        description: 'Comment for review the model',
        format: 'string'
    })
    comment: string;

    @ApiProperty({
        example: new Date(),
        description: 'Recorded date when model review data in store in bc state ',
        format: 'string'
    })
    recordDate: Date;

    @ApiProperty({
        example: EntryUserBcDetailsDto,
        description: 'Recorded date when model review data in store in bc state ',
        format: 'object'
    })
    entryUserDetail: EntryUserBcDetailsDto;

    @ApiProperty({
        example: 'PeerDs1MainnetBtaKilroyMSP',
        description: 'name of MSP of blockchain',
        format: 'string'
    })
    creatorMSP: string;

    @ApiProperty({
        example: 'http://deployedurl.com',
        description: 'Url of deployed review model',
        format: 'string'
    })
    deployedUrl: string;

    @ApiProperty({
        example: 'Instruction of model',
        description: 'Instruction of model version deployment',
        format: 'string'
    })
    deploymentInstruction: string;

    @ApiProperty({
        example: 'http://productionURL.com',
        description: 'Url of production review model',
        format: 'string'
    })
    productionURL: string;

    @ApiProperty({
        example: [
            {
                docName: 'review-document1.png',
                docURL: 'http://review-model/review-document1.png'
            }
        ],
        description: 'Url of production review model',
        format: 'array'
    })
    reviewSupportingDocument: IReviewSupportingDocument[];
}

export class BcModelReviewHistoryResponseDto {
    @ApiProperty({
        example: '9915ebe99b6249bb129590e86a858d539ac8a066047f8dfc60c95afe5039f735',
        description: 'blockchain transaction Id',
        format: 'string'
    })
    txId: string;

    @ApiProperty({
        example: false,
        description: 'It describes is model review deleted or not',
        format: 'boolean'
    })
    isDeleted: boolean;

    @ApiProperty({
        example: BcModelReviewDetailsResponseDto,
        description: 'Data of model version',
        format: 'object'
    })
    modelReview: BcModelReviewDetailsResponseDto;
}

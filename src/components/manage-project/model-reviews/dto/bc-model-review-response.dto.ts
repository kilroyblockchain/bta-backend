import { ApiProperty } from '@nestjs/swagger';

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
        format: 'string'
    })
    entryUserDetail: EntryUserBcDetailsDto;

    @ApiProperty({
        example: 'PeerDs1MainnetBtaKilroyMSP',
        description: 'name of MSP of blockchain',
        format: 'string'
    })
    creatorMSP: string;
}

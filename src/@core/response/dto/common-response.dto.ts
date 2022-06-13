import { ApiProperty, IntersectionType } from '@nestjs/swagger';

export class TimestampDto {
    @ApiProperty({
        example: new Date(),
        description: 'Created Date'
    })
    createdAt: Date;

    @ApiProperty({
        example: new Date(),
        description: 'Updated Date'
    })
    updatedAt: Date;
}

export class BlockchainVerifiedDto {
    @ApiProperty({
        example: true,
        description: 'Blockchain Verification Status'
    })
    blockchainVerified: boolean;
}

export class BaseResponseDto {
    @ApiProperty({
        example: 'id',
        description: 'ID'
    })
    id: string;

    @ApiProperty({
        example: true,
        description: 'Status'
    })
    status: boolean;
}

export class BaseResponseWithTimestamp extends IntersectionType(BaseResponseDto, TimestampDto) {}

export class CommonResponseDto extends BaseResponseWithTimestamp {}

import { ApiProperty } from '@nestjs/swagger';

export class CommonResponseDto {
    @ApiProperty({
        example: 'id',
        description: 'ID'
    })
    id: string;

    @ApiProperty({
        example: new Date(),
        description: 'Created Date'
    })
    createdAt: boolean;

    @ApiProperty({
        example: new Date(),
        description: 'Updated Date'
    })
    updatedAt: boolean;

    @ApiProperty({
        example: true,
        description: 'Status'
    })
    status: boolean;

    @ApiProperty({
        example: true,
        description: 'Blockchain Verification Status'
    })
    blockchainVerified: boolean;
}

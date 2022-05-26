import { ApiProperty } from '@nestjs/swagger';

class UserDto {
    @ApiProperty({
        example: 'id',
        description: 'ID or detail of user who reject the user'
    })
    id: string;

    @ApiProperty({
        example: 'Bhagat Gurung',
        description: 'Full Name of user'
    })
    name: string;
}

export class UserRejectInformationResponseDto {
    @ApiProperty({
        example: 'id',
        description: 'ID'
    })
    id: string;

    @ApiProperty({
        example: {
            id: 'ID',
            name: 'Manoj Pandey'
        },
        description: 'ID or detail of user who was rejected'
    })
    rejectedUserDetail: UserDto;

    @ApiProperty({
        description: 'ID or detail of user who reject the user'
    })
    rejectedByUserDetail: UserDto;

    @ApiProperty({
        example: 'Test Description for rejection',
        description: 'Description'
    })
    rejectionDescription?: string;

    @ApiProperty({
        example: true,
        description: 'Blockchain Verified Status'
    })
    blockchainVerified: boolean;

    @ApiProperty({
        example: new Date(),
        description: 'Date in which user is rejected'
    })
    createdAt: Date;
}

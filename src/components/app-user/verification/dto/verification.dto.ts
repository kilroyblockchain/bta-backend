import { ApiProperty } from '@nestjs/swagger';

export class VerificationResponse {
    @ApiProperty({
        example: 'Id',
        description: 'Id'
    })
    _id: string;

    @ApiProperty({
        example: 'bhagat@kilroyblockchain.com',
        description: 'Email'
    })
    email: string;

    @ApiProperty({
        example: 'bgurung',
        description: 'userName'
    })
    userName: string;

    @ApiProperty({
        example: 'token string',
        description: 'User accept token'
    })
    userAcceptToken: string;

    @ApiProperty({
        example: true,
        description: 'User accept flag'
    })
    userAccept: boolean;

    @ApiProperty({
        example: new Date(),
        description: 'Timestamp'
    })
    timeStamp: Date;

    @ApiProperty({
        example: 'Id',
        description: 'Requester Id'
    })
    requestedBy: string;

    @ApiProperty({
        example: 'staff',
        description: 'Subscription Type'
    })
    subscriptionType: string;

    @ApiProperty({
        example: 'staff',
        description: 'Roles'
    })
    roles: string;
}

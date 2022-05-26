import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SubscriptionTypeDto {
    @ApiProperty({
        example: '5f91c26ec4c6d325787528cf',
        description: 'User id of user to assign new subscription type',
        format: 'string'
    })
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        description: 'company Id to assign subscription type',
        uniqueItems: true
    })
    @IsNotEmpty()
    @IsString()
    readonly companyId: string;

    @ApiProperty({
        example: ['staff'],
        description: 'subscription types',
        uniqueItems: true
    })
    @IsNotEmpty()
    @IsArray()
    readonly subscriptionType: Array<string>;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetDefaultCompanyDto {
    @ApiProperty({
        example: '5f91c26ec4c6d325787528cf',
        description: 'Object Id of Company',
        format: 'string'
    })
    @IsNotEmpty()
    companyId: string;

    @ApiProperty({
        example: '5f91c26ec4c6d325787528cf',
        description: 'SubscriptionType',
        format: 'string'
    })
    @IsNotEmpty()
    subscriptionType: string;
}

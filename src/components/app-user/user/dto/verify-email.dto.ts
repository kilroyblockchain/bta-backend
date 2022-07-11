import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
    @ApiProperty({
        example: '5f91c26ec4c6d325787528cf',
        description: 'User id of user to be verified by admin',
        format: 'string'
    })
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        description: 'company Id ti update verified status',
        uniqueItems: true
    })
    @IsNotEmpty()
    @IsString()
    readonly companyRowId: string;

    @ApiProperty({
        description: 'Subscription Type '
    })
    @IsOptional()
    readonly subscriptionType: string;

    @ApiProperty({
        description: 'check registered user'
    })
    @IsOptional()
    readonly isRegisteredUser: boolean;

    @ApiProperty({
        description: 'Company Id to disable all users'
    })
    @IsOptional()
    readonly companyId: string;

    @ApiProperty({
        description: 'Id of the channel configuration: Blockchain'
    })
    @IsOptional()
    readonly channelId: string;

    @ApiProperty({
        description: 'Staffing id to be disabled'
    })
    @IsOptional()
    readonly staffingId: Array<string>;

    @IsOptional()
    @IsString()
    readonly bcNodeInfo: string;

    @IsOptional()
    @IsString()
    readonly bucketUrl: string;

    @IsOptional()
    @IsArray()
    readonly channels: string[];

    @IsOptional()
    @IsString()
    readonly organizationName: string;
}

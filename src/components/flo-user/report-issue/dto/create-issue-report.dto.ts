import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIssueReportDto {
    @ApiProperty({
        example: 'OWNERSHIP',
        description: 'Type of issue to be reported'
    })
    @IsNotEmpty()
    @IsString()
    readonly issueType: string;

    @ApiProperty({
        example: 'Kilroy Blockchain Ltd',
        description: 'Name of company'
    })
    @IsNotEmpty()
    @IsString()
    readonly companyName: string;

    @ApiProperty({
        example: 'This is my company',
        description: 'Description of report'
    })
    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @ApiProperty({
        example: 'bhagat@kilroyblockchain.com',
        description: 'Email of the reported user'
    })
    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @ApiProperty({
        example: 'contact-tracing',
        description: 'Subscription type to be register of the reported user'
    })
    @IsNotEmpty()
    @IsString()
    readonly subscriptionType: string;
}

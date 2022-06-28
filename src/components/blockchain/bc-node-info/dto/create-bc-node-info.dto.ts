import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBcNodeInfoDto {
    @ApiProperty({
        example: 'OrgKilroy',
        description: 'Name of the organization created on blockchain',
        format: 'string',
        uniqueItems: true,
        required: true
    })
    @IsNotEmpty()
    @IsString()
    orgName: string;

    @ApiProperty({
        example: 'Organization Kilroy',
        description: 'Label for the BC Node Info',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    label: string;

    @ApiProperty({
        example: 'https://api.bc.node.name',
        description: 'URL of the BC Connector Deployed',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    nodeUrl: string;

    @ApiProperty({
        example: 'YmxvY2tjaGFpbi1jb25uZWN0b3ItZHMxc2FkYTpCbG9ja2NoYWluLUNvbm5lY3Rvci1EczEtUHdkQDEyM2FzZGFk',
        description: 'Authorization Token for accessing the bc connector API',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    authorizationToken: string;
}

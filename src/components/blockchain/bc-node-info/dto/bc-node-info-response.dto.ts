import { ApiProperty } from '@nestjs/swagger';

export class BcNodeInfoResponseDto {
    @ApiProperty({
        example: 'OrgKilroy',
        description: 'Name of the organization created on blockchain',
        format: 'string',
        uniqueItems: true,
        required: true
    })
    orgName: string;

    @ApiProperty({
        example: 'Organization Kilroy',
        description: 'Label for the BC Node Info',
        format: 'string',
        required: true
    })
    label: string;

    @ApiProperty({
        example: 'https://api.bc.node.name',
        description: 'URL of the BC Connector Deployed',
        format: 'string',
        required: true
    })
    nodeUrl: string;

    @ApiProperty({
        example: 'YmxvY2tjaGFpbi1jb25uZWN0b3ItZHMxc2FkYTpCbG9ja2NoYWluLUNvbm5lY3Rvci1EczEtUHdkQDEyM2FzZGFk',
        description: 'Authorization Token for accessing the bc connector API',
        format: 'string',
        required: true
    })
    authorizationToken: string;
}

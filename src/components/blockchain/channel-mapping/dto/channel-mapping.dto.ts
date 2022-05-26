import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelMappingDto {
    @ApiProperty({
        example: '5faa30d918352f2e4c4f0b18',
        description: 'Channel Id',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    channelId: string;

    @ApiProperty({
        example: '5faa30d918352f2e4c4f0b18',
        description: 'Organization Id',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    organizationId: string;

    @ApiProperty({
        example: '5faa30d918352f2e4c4f0b18',
        description: 'Wallet Id'
    })
    @IsNotEmpty()
    @IsString()
    walletId: string;

    @ApiProperty({
        example: '5faa30d918352f2e4c4f0b18',
        description: 'User Id',
        format: 'string'
    })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        example: '5faa30d918352f2e4c4f0b18',
        description: 'Staffing Id',
        format: 'string'
    })
    @IsString()
    staffingId: string;
}

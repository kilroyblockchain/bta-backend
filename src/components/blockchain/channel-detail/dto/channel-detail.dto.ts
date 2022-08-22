import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChannelDetailDto {
    @ApiProperty({
        example: 'flo',
        description: 'Name of the channel'
    })
    @IsNotEmpty()
    @IsString()
    channelName: string;

    @ApiProperty({
        example: 'flo',
        description: 'Name of the connection profile for the channel'
    })
    @IsNotEmpty()
    @IsString()
    connectionProfileName: string;

    @ApiProperty({
        example: true,
        description: 'Flag to determine if the channel is default channel or not'
    })
    @IsOptional()
    @IsBoolean()
    isDefault: boolean;

    @IsNotEmpty()
    @IsBoolean()
    isCompanyChannel: boolean;
}

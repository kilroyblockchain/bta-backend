import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ParticipantAddDto {
    @ApiProperty({
        example: 'type'
    })
    @IsNotEmpty()
    @IsString()
    type: string;

    @ApiProperty({
        example: 'organization name'
    })
    @IsNotEmpty()
    @IsString()
    organizationName: string;

    @ApiProperty({
        example: 'http://abc.com'
    })
    @IsNotEmpty()
    @IsString()
    bcNodeUrl: string;

    @ApiProperty({
        example: 'instance name'
    })
    @IsNotEmpty()
    @IsString()
    instanceName: string;

    @ApiProperty({
        example: 'http://abc.com'
    })
    @IsNotEmpty()
    @IsString()
    oracleBucketUrl: string;

    status: boolean;

    @ApiProperty({
        example: ['5faa30d918352f2e4c4f0b18'],
        description: 'Channel Id',
        format: 'array'
    })
    @IsNotEmpty()
    @IsArray()
    channelDetailIds: string[];
}

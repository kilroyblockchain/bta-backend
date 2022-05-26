import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshAccessTokenDto {
    @ApiProperty({
        description: 'string for access token',
        format: 'string',
        uniqueItems: true
    })
    @IsNotEmpty()
    readonly accessToken: string;
}

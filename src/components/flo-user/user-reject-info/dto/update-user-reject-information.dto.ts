import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserRejectInformationDto {
    @ApiProperty({
        example: 'Subscription expired',
        description: 'Id of rejected user'
    })
    @IsOptional()
    @IsString()
    readonly description: string;
}

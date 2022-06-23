import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RejectUserDto {
    @ApiProperty({
        example: '<userId>',
        description: 'Id of rejected user'
    })
    @IsNotEmpty()
    @IsString()
    readonly rejectedUser: string;

    @ApiProperty({
        example: 'Subscription expired',
        description: 'Id of rejected user'
    })
    @IsOptional()
    readonly description: string;
}

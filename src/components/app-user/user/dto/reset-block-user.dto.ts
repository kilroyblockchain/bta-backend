import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetBlockUserDto {
    @ApiProperty({
        example: 'abc@email.com'
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;
}

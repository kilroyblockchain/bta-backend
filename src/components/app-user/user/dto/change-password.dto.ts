import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
    @ApiProperty({
        example: 'P@ssw0rd',
        description: 'The current password of the User',
        format: 'string',
        minLength: 5,
        maxLength: 255
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly currentPassword: string;

    @ApiProperty({
        example: 'P@ssw0rd',
        description: 'The new password of the User',
        format: 'string',
        minLength: 5,
        maxLength: 255
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly password: string;
}

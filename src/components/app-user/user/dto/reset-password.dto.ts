import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1Zjg5NTcwODRjNGFiNjA1YzQxNTMxNWEiLCJpYXQiOjE2MDMwODM1MjUsImV4cCI6MTYwMzA4NDcyNX0.xxD9JfPKdpCiCOPYtTOdxxechpdTq3-LE74qCKstZa8',
        description: 'Reset token',
        uniqueItems: true
    })
    @IsNotEmpty()
    readonly resetToken: string;

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

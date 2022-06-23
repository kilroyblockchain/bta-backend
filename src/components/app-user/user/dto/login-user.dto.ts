import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({
        example: 'manoj@kilroyblockchain.com',
        description: 'The email of the User',
        format: 'email',
        uniqueItems: true,
        minLength: 5,
        maxLength: 255
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        example: 'kbc123',
        description: 'The password of the User',
        format: 'string',
        minLength: 5,
        maxLength: 1024
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(1024)
    readonly password: string;

    @ApiProperty({
        example: 'reCaptcha token',
        description: 'Google reCaptcha verification code',
        format: 'string'
    })
    @IsString()
    readonly reCaptchaToken: string;
}

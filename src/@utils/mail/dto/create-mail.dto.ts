import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';
export class CreateMailDto {
    @ApiProperty({
        example: 'Free',
        description: 'The subscription type of the User',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly subscription: string;

    @ApiProperty({
        example: 'suyog@kilroyblockchain.com',
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
        example: 'P@ssw0rd',
        description: 'The password of the User',
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

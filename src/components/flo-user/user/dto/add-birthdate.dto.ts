import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AddBirthDateDto {
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
    email: string;

    @ApiProperty({
        example: '1996-01-18',
        description: 'Date of birth',
        type: 'string',
        format: 'date'
    })
    @IsNotEmpty()
    @IsString()
    readonly birthDate: Date;
}

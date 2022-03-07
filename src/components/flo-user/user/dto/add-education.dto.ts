import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AddEducationDto {
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
        example: ['5faa30d918352f2e4c4f0b18'],
        description: 'Education Id',
        format: 'array'
    })
    @IsNotEmpty()
    readonly education: [string];
}

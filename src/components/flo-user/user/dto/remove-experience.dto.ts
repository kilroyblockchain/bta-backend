import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RemoveExperienceDto {
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
        example: '5f91c26ec4c6d325787528cf',
        description: 'Experience id of user to remove',
        format: 'string'
    })
    @IsNotEmpty()
    experienceId: string;
}

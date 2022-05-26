import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OCUserRegisterDto {
    @ApiProperty({
        example: 'first name'
    })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({
        example: 'last name'
    })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({
        example: 'email'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;
    password: string;
}

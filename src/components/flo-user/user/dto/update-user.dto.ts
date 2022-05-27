import { IsNotEmpty, MinLength, MaxLength, IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({
        example: 'Suyog',
        description: 'The first name of the User',
        format: 'string',
        minLength: 2,
        maxLength: 40
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(40)
    readonly firstName: string;

    @ApiProperty({
        example: 'Khanal',
        description: 'The last name of the User',
        format: 'string',
        minLength: 2,
        maxLength: 40
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(40)
    readonly lastName: string;

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
        example: '98xxxxxxxx',
        description: 'The phone number of the User',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @ApiProperty({
        example: '5f8c3fe878eb493c3f29f28f',
        description: 'Country id',
        format: 'string'
    })
    @IsOptional()
    readonly country: string;

    @ApiProperty({
        example: '5f8c3fe878eb493c3f29f28f',
        description: 'State id'
    })
    @IsOptional()
    readonly state: string;

    @ApiProperty({
        example: 'St. Cat',
        description: 'City'
    })
    @IsOptional()
    readonly city: string;

    @ApiProperty({
        example: 'New Road, Kathmandu',
        description: 'The address of the User',
        format: 'string',
        minLength: 3,
        maxLength: 255
    })
    @IsOptional()
    readonly address: string;

    @ApiProperty({
        example: '123456',
        description: 'The zip code of the User',
        format: 'string'
    })
    @IsOptional()
    readonly zipCode: string;

    @ApiProperty({
        example: 'Developer',
        description: 'The job title of the User',
        format: 'string'
    })
    @IsOptional()
    readonly jobTitle: string;
}

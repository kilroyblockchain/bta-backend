import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
    @ApiProperty({
        example: 'other',
        description: 'Business owner wanting to do COVID-19',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly subscriptionType: string;

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
    @IsNotEmpty()
    @IsString()
    readonly country: string;

    @ApiProperty({
        example: '5f8c3fe878eb493c3f29f28f',
        description: 'State id'
    })
    @IsNotEmpty()
    readonly state: string;

    @ApiProperty({
        example: 'New Road, Kathmandu',
        description: 'The address of the User',
        format: 'string',
        minLength: 3,
        maxLength: 255
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    readonly address: string;

    @ApiProperty({
        example: 'St. Cat',
        description: 'City'
    })
    @IsNotEmpty()
    @IsString()
    readonly city: string;

    @ApiProperty({
        example: '123456',
        description: 'The zip code of the User',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly zipCode: string;

    @ApiProperty({
        example: 'P@ssw0rd',
        description: 'The password of the User',
        format: 'string'
    })
    @IsString()
    readonly password: string;

    @ApiProperty({
        example: 'Kilroy Blockchain',
        description: 'Users Company name',
        format: 'string'
    })
    @IsString()
    @IsNotEmpty()
    readonly companyName: string;

    @ApiProperty({
        example: ['5faa30d918352f2e4c4f0b18'],
        description: 'Staffing Id',
        format: 'array'
    })
    @IsOptional()
    readonly staffingId: [string];

    @ApiProperty({
        example: '6b45f6a7b442c3afc5931091fbdb2510f1.jpg',
        description: 'Users Company logo',
        format: 'string'
    })
    @IsOptional()
    readonly companyLogo: string;

    @ApiProperty({
        example: 'US',
        description: 'The country of the User like Nepal',
        format: 'string'
    })
    @IsOptional()
    readonly companyCountry: string;

    @ApiProperty({
        example: 2469,
        description: 'The state id of the Company-> 2469 is Gandaki state'
    })
    @IsOptional()
    readonly companystate: string;

    @ApiProperty({
        example: 'St. Cat',
        description: 'City'
    })
    @IsOptional()
    readonly companyCity: string;

    @ApiProperty({
        example: 'New Road, Kathmandu',
        description: 'The address where company is located',
        format: 'string',
        minLength: 5,
        maxLength: 255
    })
    @IsOptional()
    readonly companyAddress: string;

    @ApiProperty({
        example: '123456',
        description: 'The zip code  where company is located',
        format: 'string'
    })
    @IsOptional()
    readonly companyZipCode: string;

    @ApiProperty({
        example: 'Long text',
        description: 'Describe what your business does',
        format: 'string'
    })
    @IsOptional()
    readonly aboutOrganization: string;

    @ApiProperty({
        example: 'reCaptcha token',
        description: 'Google reCaptcha verification code',
        format: 'string'
    })
    @IsString()
    readonly reCaptchaToken: string;
}

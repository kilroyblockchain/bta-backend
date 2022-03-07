import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserByTransferDto {
    @ApiProperty({
        example: '1fd06197-1419-4ef9-a80d-22f4858415b9',
        description: 'Transfer token'
    })
    @IsNotEmpty()
    @IsString()
    readonly transferToken: string;

    @ApiProperty({
        example: 'Bhagat',
        description: 'First name'
    })
    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @ApiProperty({
        example: 'Gurung',
        description: 'Last name'
    })
    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @ApiProperty({
        example: '98021xxxxx',
        description: 'Phone number'
    })
    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @ApiProperty({
        example: 'US',
        description: 'Country code'
    })
    @IsNotEmpty()
    @IsString()
    readonly country: string;

    @ApiProperty({
        example: 3919,
        description: 'State id'
    })
    @IsNotEmpty()
    @IsString()
    readonly state: string;

    @ApiProperty({
        example: 'South East St.',
        description: 'Address'
    })
    @IsNotEmpty()
    @IsString()
    readonly address: string;

    @ApiProperty({
        example: '24433',
        description: 'Zip code'
    })
    @IsNotEmpty()
    @IsString()
    readonly zipCode: string;

    @ApiProperty({
        example: 'CEO',
        description: 'Job title of user'
    })
    @IsNotEmpty()
    @IsString()
    readonly jobTitle: string;

    @ApiProperty({
        example: 'reCaptcha token',
        description: 'Google reCaptcha verification code',
        format: 'string'
    })
    @IsString()
    readonly reCaptchaToken: string;
}

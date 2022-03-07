import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class NewUserDto {
    @ApiProperty({
        example: 'ABC Charity Organization'
    })
    @IsOptional()
    readonly sponsorOrganizationName: string;

    @ApiProperty({
        example: 'Bhagat',
        description: 'First Name'
    })
    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @ApiProperty({
        example: 'Gurung',
        description: 'Last Name'
    })
    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @ApiProperty({
        example: '984565xxxxx',
        description: 'Phone Number'
    })
    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @ApiProperty({
        example: 'bhagat@kilroyblockchain.com',
        description: 'Email'
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        example: '5f8c3fe878eb493c3f29f28f',
        description: 'Country id'
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
        example: 'XYZ Street',
        description: 'Address'
    })
    @IsOptional()
    readonly address: string;

    @ApiProperty({
        example: '23321',
        description: 'Zip Code'
    })
    @IsOptional()
    readonly zipCode: string;

    @ApiProperty({
        example: ['5faa30d918352f2e4c4f0b18'],
        description: 'Staffing Id',
        format: 'array'
    })
    @IsNotEmpty()
    @IsArray()
    readonly staffingId: [string];
}

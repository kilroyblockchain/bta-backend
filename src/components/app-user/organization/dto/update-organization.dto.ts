import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto {
    @ApiProperty({
        example: 'Kilroy Blockchain',
        description: 'Users Company name',
        format: 'string'
    })
    @IsString()
    @IsNotEmpty()
    readonly companyName: string;

    @ApiProperty({
        example: '6b45f6a7b442c3afc5931091fbdb2510f1.jpg',
        description: 'Users Company logo',
        format: 'string'
    })
    @IsString()
    readonly companyLogo: string;

    @ApiProperty({
        example: 'US',
        description: 'The country code of the User like US',
        format: 'string'
    })
    @IsOptional()
    readonly country: string;

    @ApiProperty({
        example: 321,
        description: 'The state of the User',
        format: 'string'
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
        description: 'The address where company is located',
        format: 'string',
        minLength: 3,
        maxLength: 255
    })
    @IsString()
    readonly address: string;

    @ApiProperty({
        example: '123456',
        description: 'The zip code  where company is located',
        format: 'string'
    })
    @IsString()
    readonly zipCode: string;
}

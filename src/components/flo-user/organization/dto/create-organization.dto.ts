import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ISubscription } from '../interfaces/organization.interface';
import { ROLE } from 'src/@core/constants';

export class CreateOrganizationDto {
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
        example: '5f8c3fe878eb493c3f29f28f',
        description: 'Country id',
        format: 'string'
    })
    @IsOptional()
    readonly country: string;

    @ApiProperty({
        example: '5f8c3fe878eb493c3f29f28f',
        description: 'State id',
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
        minLength: 5,
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

    @ApiProperty({
        example: 'Long text',
        description: 'Describe what your business does',
        format: 'string'
    })
    @IsString()
    readonly aboutOrganization: string;

    @ApiProperty({
        example: [{ type: ROLE.STAFF, status: false }],
        description: 'Subscription types assigned to organization',
        format: 'array'
    })
    @IsString()
    readonly subscription: Array<ISubscription>;
}

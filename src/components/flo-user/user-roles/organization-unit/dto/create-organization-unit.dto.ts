import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationUnitDto {
    @ApiProperty({
        example: '6021191f51c4b2219c95ffb1',
        description: 'company of Unit',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly companyID: string;

    @ApiProperty({
        example: 'Manager',
        description: 'Name of unit ',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly unitName: string;

    @ApiProperty({
        example: 'Manager does A - Z',
        description: 'Description of unit ',
        format: 'string'
    })
    @IsOptional()
    readonly unitDescription: string;

    @ApiProperty({
        example: 'staff',
        description: 'Subscription type',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly subscriptionType: string;

    @ApiProperty({
        description: 'Assigned feature List and their access types',
        example: ['6021191f51c4b2219c95ffb1']
    })
    @IsOptional()
    readonly featureListId: [string];
}

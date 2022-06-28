import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStaffingDto {
    constructor(createStaffing: CreateStaffingDto) {
        Object.assign(this, createStaffing);
    }
    @ApiProperty({
        example: '6021191f51c4b2219c95ffb1',
        description: 'Staff unit',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly organizationUnitId: string;

    @ApiProperty({
        example: 'MAnager',
        description: 'Name of Staffing ',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly staffingName: string;

    @ApiProperty({
        description: 'Assigned feature List and their access types',
        example: [{ featureId: '0211ce17b48770a285a8aca', accessType: ['READ'] }],
        format: 'array'
    })
    @IsOptional()
    readonly featureAndAccess: {
        featureId: string;
        accessType: string[];
    }[];
}

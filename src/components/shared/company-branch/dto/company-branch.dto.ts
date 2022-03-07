import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CompanyBranchDto {
    @ApiProperty({
        example: '5433432',
        description: 'Branch Id'
    })
    @IsOptional()
    readonly branchId?: string;

    @ApiProperty({
        example: 'ABC Branch',
        description: 'Type'
    })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({
        example: true,
        description: 'Use in report i.e. if true, used in graph and report'
    })
    @IsOptional()
    readonly useInReport?: boolean;

    @ApiProperty({
        example: '11245555d55a5s4s4d55de5d4',
        description: 'Country id'
    })
    @IsOptional()
    readonly country?: string;

    @ApiProperty({
        example: '11245555d55a5s4s4d55de343',
        description: 'State id'
    })
    @IsOptional()
    readonly state?: string;

    @ApiProperty({
        example: 'XYZ Street',
        description: 'Address'
    })
    @IsOptional()
    readonly address?: string;

    @ApiProperty({
        example: '23321',
        description: 'Zip Code'
    })
    @IsOptional()
    readonly zipCode?: string;

    @IsOptional()
    readonly localName?: string;

    @IsOptional()
    readonly city?: string;

    @IsOptional()
    readonly phone?: string;

    @IsOptional()
    readonly fax?: string;

    @IsOptional()
    readonly districtId?: string;

    @IsOptional()
    readonly districtStateName?: string;

    @IsOptional()
    readonly address2?: string;

    @IsOptional()
    readonly address3?: string;

    @IsOptional()
    readonly regionId?: string;

    @IsOptional()
    readonly regionName?: string;

    @IsOptional()
    readonly usState?: string;
}

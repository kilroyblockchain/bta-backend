import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';
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
        example: 'ai-engineer-1',
        description: 'Name of bucket group ',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly oracleGroupName: string;

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

    @ApiProperty({
        description: 'Id of bcNodeInfo for staffing',
        example: '62bf110abae854986e95799b',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    bcNodeInfo: string;

    @ApiProperty({
        description: 'Id of bc channel for staffing',
        example: ['62bea0296e7a4bfd3ff56268'],
        format: 'array'
    })
    @IsNotEmpty()
    @IsArray()
    channels: string[];

    @ApiProperty({
        description: 'Url of oracle bucket for staffing',
        example: 'https://orcalebucket.org',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    bucketUrl: string;
}

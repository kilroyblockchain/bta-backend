import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddCompanyDto {
    @ApiProperty({
        example: 'user id'
    })
    @IsNotEmpty()
    @IsString()
    readonly userId: string;

    @ApiProperty({
        example: 'ABC Organization'
    })
    @IsOptional()
    readonly sponsorOrganizationName: string;

    @ApiProperty({
        example: 'staffing id'
    })
    @IsNotEmpty()
    @IsArray()
    readonly staffingId: Array<string>;

    @ApiProperty({
        example: 'contact-tracing'
    })
    @IsOptional()
    readonly subscription: string;
}

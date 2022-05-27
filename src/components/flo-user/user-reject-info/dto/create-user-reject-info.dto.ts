import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserRejectInformationDto {
    @ApiProperty({
        example: '<userid>',
        description: 'Id of rejected user'
    })
    @IsNotEmpty()
    @IsString()
    readonly rejectedUser: string;

    rejectedOrganization: string;

    @ApiProperty({
        example: 'Subscription expired',
        description: 'Id of rejected user'
    })
    @IsOptional()
    @IsString()
    readonly description: string;

    rejectedBy: string;
}

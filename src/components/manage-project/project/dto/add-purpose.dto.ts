import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddProjectPurposeDto {
    @ApiProperty({
        example: 'e-commerce project',
        description: 'This is purpose of project which is added by stakeholder',
        format: 'string',
        required: false
    })
    @IsOptional()
    @IsString()
    purpose: string;

    @IsOptional()
    @ApiProperty({
        type: 'file',
        required: false,
        description: 'This is document of project purpose'
    })
    purposeDoc: Express.Multer.File | string;

    @ApiProperty({
        example: 'This is blockchain project',
        description: 'Description of project',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    details: string;

    @ApiProperty({
        example: 'Finance',
        description: 'This describe what type of project it is',
        format: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    domain: string;
}

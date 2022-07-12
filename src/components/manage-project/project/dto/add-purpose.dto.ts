import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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
}

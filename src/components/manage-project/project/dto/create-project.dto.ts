import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
    @ApiProperty({
        example: 'Blockchain',
        description: 'Project Name',
        format: 'string',
        uniqueItems: true,
        required: true
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        example: ['5faa30d918352f2e4c4f0b18'],
        description: 'User Id',
        format: 'array'
    })
    @IsNotEmpty()
    @IsArray()
    members: string[];
}

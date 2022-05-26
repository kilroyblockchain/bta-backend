import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ProjectStatusEnum } from '../enum/project-status.enum';

export class ProjectAddDto {
    @ApiProperty({
        example: 'name'
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        example: 'detail'
    })
    @IsNotEmpty()
    @IsString()
    detail: string;

    @ApiProperty({
        example: ['5faa30d918352f2e4c4f0b18'],
        description: 'User Id',
        format: 'array'
    })
    @IsNotEmpty()
    @IsArray()
    users: string[];

    @ApiProperty({
        example: 'domain'
    })
    @IsNotEmpty()
    @IsString()
    domain: string;

    @ApiProperty({
        example: 'version'
    })
    @IsNotEmpty()
    @IsString()
    version: string;

    @ApiProperty({
        example: 'purpose'
    })
    @IsNotEmpty()
    @IsString()
    purpose: string;

    projectStatus: ProjectStatusEnum;

    status: boolean;
}

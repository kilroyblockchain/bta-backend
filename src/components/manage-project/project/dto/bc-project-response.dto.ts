import { ApiProperty } from '@nestjs/swagger';

export class BCProjectResponseDto {
    @ApiProperty({
        example: '62c93bd2e6bd374d4fa8fbc7',
        description: 'Project Id',
        format: 'string'
    })
    projectId: string;

    @ApiProperty({
        example: 'Blockchain',
        description: 'Project name',
        format: 'string'
    })
    name: string;

    @ApiProperty({
        example: 'This is blockchain project',
        description: 'Description of project',
        format: 'string'
    })
    details: string;

    @ApiProperty({
        example: 'Finance',
        description: 'This describe what type of project it is',
        format: 'string'
    })
    domain: string;

    @ApiProperty({
        example: ['5faa30d918352f2e4c4f0b18'],
        description: 'User Id',
        format: 'array'
    })
    members: string[];

    @ApiProperty({
        example: 'purpose',
        description: 'Purpose of the project',
        format: 'string'
    })
    purpose: string;

    @ApiProperty({
        example: 'John',
        description: 'user name who entry the project',
        format: 'string'
    })
    entryUser: string;

    @ApiProperty({
        example: new Date(),
        description: 'Project created date in Blockchain'
    })
    recordDate: Date;
}

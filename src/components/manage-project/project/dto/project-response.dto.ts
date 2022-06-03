import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
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
        example: true,
        description: 'Status of project',
        format: 'boolean'
    })
    status: boolean;

    @ApiProperty({
        example: new Date(),
        description: 'Project created date'
    })
    createdAt: Date;

    @ApiProperty({
        example: new Date(),
        description: 'Project updated date'
    })
    updatedAt: Date;

    @ApiProperty({
        example: '60e6fe33d27e2133c485513b',
        description: 'Id of user who create the project',
        format: 'string'
    })
    createdBy: string;

    @ApiProperty({
        example: '608a49c2899c17003f7d2576',
        description: 'Company id where project was created'
    })
    companyId: string;
}

export class AllProjectResponseDto {
    @ApiProperty({
        example: 'Blockchain',
        description: 'Project name'
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
        example: [
            {
                firstName: 'Suyog',
                lasName: 'Khanal',
                email: 'suyog@kilroyblockchain.com'
            }
        ],
        description: 'Project members details',
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
        example: true,
        description: 'Status of project',
        format: 'boolean'
    })
    status: boolean;

    @ApiProperty({
        example: new Date(),
        description: 'Project created date'
    })
    createdAt: Date;

    @ApiProperty({
        example: new Date(),
        description: 'Project updated date'
    })
    updatedAt: Date;

    @ApiProperty({
        example: {
            firstName: 'Suyog',
            lasName: 'Khanal',
            email: 'suyog@kilroyblockchain.com'
        },

        description: 'Project members details',
        format: 'object'
    })
    createdBy: string;

    @ApiProperty({
        example: '608a49c2899c17003f7d2576',
        description: 'Company id where project was created'
    })
    companyId: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class AllVersionAiModelExp {
    @ApiProperty({
        example: '62b1798d6778381f09a82d29',
        description: "Id of the Ai Model's experiment",
        format: 'string'
    })
    _id: string;

    @ApiProperty({
        example: 'exp_0',
        description: 'Name of experiment',
        format: 'string'
    })
    expNo: string;

    @ApiProperty({
        example: '60e6fe33d27e2133c485513b',
        description: 'Id of version',
        format: 'string'
    })
    version: string;

    @ApiProperty({
        example: '60e6fe33d27e2133c485513b',
        description: 'Id of version',
        format: 'string'
    })
    project: string;

    @ApiProperty({
        example: '62b1798d6778381f09a82d29',
        description: "Id of the Ai Model's experiment generated by lean function",
        format: 'string'
    })
    id: string;

    @ApiProperty({
        example: new Date(),
        description: 'Experiment created date datetime'
    })
    createdAt: Date;

    @ApiProperty({
        example: new Date(),
        description: 'Experiment updated date datetime'
    })
    updatedAt: Date;
}

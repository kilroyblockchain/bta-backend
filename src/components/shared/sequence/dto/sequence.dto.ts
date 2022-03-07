import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SequenceDto {
    @ApiProperty({
        example: '5f8d83e4310c790ad80bfa04',
        description: 'Organization id',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly organizationId: string;

    @ApiProperty({
        example: 'KBLK',
        description: 'Organization Code',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly organizationCode: string;

    @ApiProperty({
        example: 'user',
        description: 'Sequence for module',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly module: string;

    @ApiProperty({
        example: 3,
        description: 'Current Seq',
        format: 'number'
    })
    @IsNotEmpty()
    @IsNumber()
    readonly currentSeq: number;

    @ApiProperty({
        example: 3,
        description: 'Seq Increment By',
        format: 'number'
    })
    @IsNotEmpty()
    @IsNumber()
    readonly incrementBy: number;
}

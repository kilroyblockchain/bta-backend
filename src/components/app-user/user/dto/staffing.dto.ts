import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';

export class StaffingDto {
    @ApiProperty({
        example: '5f91c26ec4c6d325787528cf',
        description: 'User id of user to assign staffingId and Roles',
        format: 'string'
    })
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        example: ['5faa30d918352f2e4c4f0b18'],
        description: 'Staffing Id',
        format: 'array'
    })
    @IsNotEmpty()
    @IsArray()
    readonly staffingId: [string];
}

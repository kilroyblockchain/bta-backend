import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SkillDto {
    createdBy: string;
    @ApiProperty({
        example: 'Marketing',
        description: 'Skill Title'
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    status: boolean;
}

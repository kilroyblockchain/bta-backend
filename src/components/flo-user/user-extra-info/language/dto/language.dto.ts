import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LanguageDto {
    createdBy: string;
    @ApiProperty({
        example: 'French',
        description: 'Language Title'
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    status: boolean;
}

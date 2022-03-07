import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetBlogDto {
    @ApiProperty({
        example: '5f91c26ec4c6d325787528cf',
        description: 'blog url to get blog detail',
        format: 'string'
    })
    @IsNotEmpty()
    url: string;
}

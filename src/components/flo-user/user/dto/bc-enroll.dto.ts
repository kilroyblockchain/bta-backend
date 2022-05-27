import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BcEnrollDto {
    @ApiProperty({
        example: '5f91c26ec4c6d325787528cf',
        description: 'UserID of registered user on DB',
        format: 'string'
    })
    @IsNotEmpty()
    userName: string;

    @ApiProperty({
        example: 'Test@1234',
        description: 'Password for user',
        format: 'string'
    })
    @IsNotEmpty()
    enrollmentSecret: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OCUserGroupAddDto {
    @ApiProperty({
        example: 'group id'
    })
    @IsNotEmpty()
    @IsString()
    groupId: string;

    @ApiProperty({
        example: 'user name'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

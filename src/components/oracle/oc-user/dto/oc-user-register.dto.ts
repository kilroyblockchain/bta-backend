import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OCUserRegisterDto {
    @ApiProperty({
        example: 'first name'
    })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({
        example: 'last name'
    })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({
        example: 'email'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;
    password: string;

    @ApiProperty({
        example: 'ai-engineer-1',
        description: 'This is group name which should created on oracle group',
        format: 'string'
    })
    @IsOptional()
    @IsString()
    oracleGroupName: string;
}

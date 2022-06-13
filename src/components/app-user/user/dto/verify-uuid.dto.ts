import { IsNotEmpty, IsUUID, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyUuidDto {
    @ApiProperty({
        description: 'uuid to verify user',
        format: 'uuid',
        uniqueItems: true
    })
    @IsNotEmpty()
    @IsUUID()
    readonly verification: string;

    @ApiProperty({
        description: 'company Id ti update verified status',
        uniqueItems: true
    })
    @IsNotEmpty()
    @IsString()
    readonly companyId: string;
}

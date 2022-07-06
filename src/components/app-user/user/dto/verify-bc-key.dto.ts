import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyBcKeyDto {
    @ApiProperty({
        example: '69454a84d2f7098ba12bd1013b6cb2e1457e64d66952e4f2691e0f2946e093a0',
        description: 'The blockchain key of the user to verify',
        format: 'string',
        minLength: 2,
        maxLength: 255
    })
    @IsNotEmpty()
    @IsString()
    bcKey: string;

    constructor(bcKey: string) {
        this.bcKey = bcKey;
    }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IUser } from 'src/components/flo-user/user/interfaces/user.interface';
import { IParticipant } from 'src/components/participant/interfaces/participant.interface';

export class UserMappingAddDto {
    @ApiProperty({
        example: '5faa30d918352f2e4c4f0b18'
    })
    @IsNotEmpty()
    @IsString()
    walletId: string;

    @ApiProperty({
        example: '5faa30d918352f2e4c4f0b18'
    })
    @IsNotEmpty()
    @IsString()
    userId: IUser;

    @ApiProperty({
        example: '5faa30d918352f2e4c4f0b18',
        description: 'ParticipantId'
    })
    @IsNotEmpty()
    @IsString()
    participantId: IParticipant;
}

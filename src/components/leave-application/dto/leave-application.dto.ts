import { LEAVE_STATUS } from 'src/@core/constants/leave-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class LeaveApplicationDto {
    addedBy: string;
    company: string;
    signature: string;
    @ApiProperty({
        description: `Leave Started Date`,
        example: new Date()
    })
    @IsNotEmpty()
    leaveFrom: Date;

    @ApiProperty({
        description: `Leave Ending date`,
        example: new Date()
    })
    @IsNotEmpty()
    leaveTo: Date;

    @ApiProperty({
        description: `Leave Hours`,
        example: 10
    })
    @IsNotEmpty()
    numberOfHours: number;

    @ApiProperty({
        description: `Leave type`,
        example: 'Personal'
    })
    @IsNotEmpty()
    @IsString()
    leaveType: string;
}

export class LeaveResponseDto {
    @ApiProperty({
        description: `Admin Response to applied leave`,
        example: LEAVE_STATUS.ACCEPTED
    })
    @IsOptional()
    response: string;

    @ApiProperty({
        description: `Comment while responding to leave`,
        example: 'Leave Accepted.'
    })
    @IsOptional()
    comment: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class TravelPermitDto {
    addedBy: string;
    company: string;

    @ApiProperty({
        description: `Account Code`,
        example: 'ACC-12'
    })
    @IsNotEmpty()
    @IsString()
    accountCode: string;

    @ApiProperty({
        description: `Requisition Date`,
        example: new Date()
    })
    @IsNotEmpty()
    @IsDateString()
    requisitionDate: Date;

    @ApiProperty({
        description: `Mode of Travel`,
        example: 'By Air'
    })
    @IsNotEmpty()
    @IsString()
    modeOfTravel: string;

    @ApiProperty({
        description: `Destination`,
        example: 'Arkansas'
    })
    @IsNotEmpty()
    @IsString()
    destination: string;

    @ApiProperty({
        description: `Reason For Travel`,
        example: 'Official Visit'
    })
    @IsNotEmpty()
    @IsString()
    reasonForTravel: string;

    @ApiProperty({
        description: `Date of Deaparture`,
        example: new Date()
    })
    @IsNotEmpty()
    @IsDateString()
    departureDate: Date;

    @ApiProperty({
        description: `Date of Deaparture`,
        example: new Date()
    })
    @IsNotEmpty()
    @IsDateString()
    returnDate: Date;

    @ApiProperty({
        description: `Personal vehical number`,
        example: 'MH-A-123'
    })
    @IsOptional()
    personalVehicleNumber: string;

    @ApiProperty({
        description: `lodging Cost`,
        example: 1200
    })
    @IsNotEmpty()
    @IsNumber()
    lodgingCost: number;

    @ApiProperty({
        description: `Meal Cost`,
        example: 500
    })
    @IsNotEmpty()
    @IsNumber()
    mealsCost: number;

    @ApiProperty({
        description: `Conference Fee`,
        example: 2000
    })
    @IsNotEmpty()
    @IsNumber()
    conferenceFees: number;

    @ApiProperty({
        description: `Credit card needed or not`,
        example: false
    })
    @IsNotEmpty()
    @IsBoolean()
    isCreditCardNeeded: boolean;

    @ApiProperty({
        description: `can exceeds daily hotel or not`,
        example: true
    })
    @IsNotEmpty()
    @IsBoolean()
    permissionToExceedDailyHotelAndMealMaximum: boolean;

    @ApiProperty({
        description: `Can travel out of state or not`,
        example: false
    })
    @IsNotEmpty()
    @IsBoolean()
    permissionForOutOfStateTravel: boolean;
}

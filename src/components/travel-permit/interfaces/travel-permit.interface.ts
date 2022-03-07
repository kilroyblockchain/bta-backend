import { Document } from 'mongoose';

export interface ITravelPermit extends Document {
    addedBy: string;
    company: string;
    status: boolean;
    isDeleted: boolean;
    accountCode: string;
    requisitionDate: Date;
    modeOfTravel: string;
    destination: string;
    reasonForTravel: string;
    departureDate: Date;
    returnDate: Date;
    personalVehicleNumber: string;
    lodgingCost: number;
    mealsCost: number;
    conferenceFees: number;
    isCreditCardNeeded: boolean;
    permissionToExceedDailyHotelAndMealMaximum: boolean;
    permissionForOutOfStateTravel: boolean;
}

export interface ITravelPermitResponse {
    id: string;
    status: boolean;
    account_Code: string;
    requisition_Date: Date;
    mode_Of_Travel: string;
    destination: string;
    reason_For_Travel: string;
    departure_Date: Date;
    return_Date: Date;
    personal_Vehicle_Number: string;
    lodging_Cost: number;
    meals_Cost: number;
    conference_Fees: number;
    is_Credit_Card_Needed: boolean;
    permission_To_Exceed_Daily_Hotel_And_Meal_Maiximum: boolean;
    permission_For_Out_Of_State_Travel: boolean;
}

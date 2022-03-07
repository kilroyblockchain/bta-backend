import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const TravelPermitSchema = new Schema(
    {
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: true
        },
        status: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        accountCode: {
            type: String,
            required: true
        },
        requisitionDate: {
            type: Date
        },
        modeOfTravel: {
            type: String,
            required: true
        },
        destination: {
            type: String,
            required: true
        },
        reasonForTravel: {
            type: String,
            required: true
        },
        departureDate: {
            type: Date,
            required: true
        },
        returnDate: {
            type: Date
        },
        personalVehicleNumber: {
            type: String
        },
        lodgingCost: {
            type: Number
        },
        mealsCost: {
            type: Number
        },
        conferenceFees: {
            type: Number
        },
        isCreditCardNeeded: {
            type: Boolean
        },
        permissionToExceedDailyHotelAndMealMaximum: {
            type: Boolean,
            default: false
        },
        permissionForOutOfStateTravel: {
            type: Boolean,
            default: false
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

TravelPermitSchema.plugin(mongoosePaginate);

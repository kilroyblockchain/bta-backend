import { getSearchFilterWithRegexAll } from 'src/@core/utils/query-filter.utils';
import { TRAVEL_PERMIT_CONSTANT } from 'src/@core/constants/api-error-constants';
import { TravelPermitDto } from './dto/travel-permit.dto';
import { AuthService } from 'src/components/auth/auth.service';
import { ITravelPermit, ITravelPermitResponse } from './interfaces/travel-permit.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PaginateModel, PaginateResult } from 'mongoose';
import { Request } from 'express';
import { getClientTimezoneId } from 'src/@core/utils/common.utils';
import { getFinalPaginationResult } from 'src/@core/utils/aggregate-paginate.utils';

@Injectable()
export class TravelPermitService {
    constructor(@InjectModel('TravelPermit') private readonly TravelPermitModel: PaginateModel<ITravelPermit>, private authService: AuthService) {}

    async createTravelPermit(createDto: TravelPermitDto, req: Request): Promise<ITravelPermitResponse> {
        try {
            const loggedInUser = this.authService.getLoggedInUserInformationFromRequest(req);
            createDto.addedBy = loggedInUser.id;
            createDto.company = <string>loggedInUser.defaultCompany.companyId;
            const travelPermit = new this.TravelPermitModel(createDto);
            travelPermit.requisitionDate = new Date(createDto.requisitionDate);
            travelPermit.departureDate = new Date(createDto.departureDate);
            travelPermit.returnDate = new Date(createDto.returnDate);
            const savedPermit = await travelPermit.save();
            return this.buildTravelPermitResponse(savedPermit);
        } catch (err) {
            throw new BadRequestException(err, TRAVEL_PERMIT_CONSTANT.UNABLE_TO_CREATE_TRAVEL_PERMIT);
        }
    }

    async findAllTravelPermits(req: Request): Promise<PaginateResult<ITravelPermitResponse>> {
        try {
            const loggedInUserDetail = this.authService.getLoggedInUserInformationFromRequest(req);
            const { status, search, searchValue, deleted, isStaff } = req.query;
            const page = req.query.page && req.query.page !== '0' ? Number(req.query.page) : null;
            const limit = req.query.limit ? Number(req.query.limit) : null;
            const searchQuery = search && search === 'true' && searchValue ? getSearchFilterWithRegexAll(searchValue, ['accountCode', 'modeOfTravel', 'destination', 'reasonForTravel', 'personalVehicleNumber', 'createdDateTime', 'requisitionDateTime', 'departureDateTime', 'returnDateTime']) : {};
            let query;
            const verified = status && status.toString().toUpperCase() === 'TRUE' ? true : false;
            if (deleted && deleted.toString().toUpperCase() === 'TRUE') {
                query = { isDeleted: true };
            } else {
                verified ? (query = { $or: [{ isDeleted: false }, { isDeleted: null }], status: true }) : (query = { $or: [{ isDeleted: false }, { isDeleted: null }], status: false });
            }

            if (isStaff) {
                query = {
                    ...query,
                    addedBy: loggedInUserDetail.id
                };
            }

            query = {
                ...query,
                company: loggedInUserDetail.defaultCompany.companyId
            };

            const traverPermitData = await this.TravelPermitModel.aggregate([
                {
                    $match: query
                },
                {
                    $addFields: {
                        createdDateTime: { $dateToString: { format: '%Y-%m-%d %H:%M', date: '$createdAt', timezone: getClientTimezoneId(req) } },
                        requisitionDateTime: { $dateToString: { format: '%Y-%m-%d %H:%M', date: '$requisitionDate', timezone: getClientTimezoneId(req) } },
                        departureDateTime: { $dateToString: { format: '%Y-%m-%d %H:%M', date: '$departureDate', timezone: getClientTimezoneId(req) } },
                        returnDateTime: { $dateToString: { format: '%Y-%m-%d %H:%M', date: '$returnDate', timezone: getClientTimezoneId(req) } }
                    }
                },
                {
                    $match: searchQuery
                },
                {
                    $sort: { updatedAt: -1 }
                },
                {
                    $facet: {
                        metadata: [{ $count: 'total' }, { $addFields: { page: page ? page : 1, limit: limit ? limit : 10 } }],
                        data: [{ $skip: (page - 1) * limit }, { $limit: limit }]
                    }
                }
            ]);
            const options = { limit, page };
            const finalResult = getFinalPaginationResult(traverPermitData, options);

            return this.buildPaginatedData(finalResult);
        } catch (error) {
            throw new BadRequestException(error, TRAVEL_PERMIT_CONSTANT.UNABLE_TO_FIND_TRAVEL_PERMIT);
        }
    }

    async findTravelPermitById(id: string, buildResponse = true): Promise<ITravelPermitResponse | ITravelPermit> {
        const travelPermit = await this.TravelPermitModel.findById(id);
        if (!travelPermit) {
            throw new NotFoundException(TRAVEL_PERMIT_CONSTANT.UNABLE_TO_FIND_TRAVEL_PERMIT);
        }
        return buildResponse ? this.buildTravelPermitResponse(travelPermit) : travelPermit;
    }

    async updateTravelPermit(id: string, updateDto: TravelPermitDto): Promise<ITravelPermitResponse> {
        const travelPermit = <ITravelPermit>await this.findTravelPermitById(id, false);
        try {
            travelPermit.accountCode = updateDto.accountCode;
            travelPermit.requisitionDate = new Date(updateDto.requisitionDate);
            travelPermit.modeOfTravel = updateDto.modeOfTravel;
            travelPermit.destination = updateDto.destination;
            travelPermit.reasonForTravel = updateDto.reasonForTravel;
            travelPermit.departureDate = new Date(updateDto.departureDate);
            travelPermit.returnDate = new Date(updateDto.returnDate);
            travelPermit.personalVehicleNumber = updateDto.personalVehicleNumber;
            travelPermit.lodgingCost = updateDto.lodgingCost;
            travelPermit.mealsCost = updateDto.mealsCost;
            travelPermit.conferenceFees = updateDto.conferenceFees;
            travelPermit.isCreditCardNeeded = updateDto.isCreditCardNeeded;
            travelPermit.permissionToExceedDailyHotelAndMealMaximum = updateDto.permissionToExceedDailyHotelAndMealMaximum;
            travelPermit.permissionForOutOfStateTravel = updateDto.permissionForOutOfStateTravel;
            const updatedPermit = await travelPermit.save();
            return this.buildTravelPermitResponse(updatedPermit);
        } catch (err) {
            throw new BadRequestException(err, TRAVEL_PERMIT_CONSTANT.UNABLE_TO_UPDATE_TRAVEL_PERMIT);
        }
    }

    async changePermitStatus(id: string, req: Request): Promise<ITravelPermitResponse> {
        const { status } = req.query;
        if (!status) {
            throw new BadRequestException(TRAVEL_PERMIT_CONSTANT.STATUS_IS_REQUIRED);
        }
        const travelPermit = <ITravelPermit>await this.findTravelPermitById(id, false);
        if (status && status.toString().toUpperCase() === 'TRUE') {
            travelPermit.status = true;
            if (travelPermit.isDeleted) {
                travelPermit.isDeleted = false;
            }
        }
        if (status && status.toString().toUpperCase() === 'FALSE') {
            travelPermit.status = false;
        }
        return this.buildTravelPermitResponse(await travelPermit.save());
    }

    async deleteTravelPermit(id: string): Promise<ITravelPermitResponse> {
        const travelPermit = <ITravelPermit>await this.findTravelPermitById(id, false);
        travelPermit.isDeleted = true;
        return this.buildTravelPermitResponse(await travelPermit.save());
    }

    buildPaginatedData(traverPermitData: PaginateResult<ITravelPermit>): PaginateResult<ITravelPermitResponse> {
        return {
            docs: traverPermitData.docs.map((travelPermit) => this.buildTravelPermitResponse(travelPermit)),
            page: traverPermitData.page,
            pages: traverPermitData?.pages,
            limit: traverPermitData.limit,
            total: traverPermitData.total,
            offset: traverPermitData?.offset
        };
    }

    buildTravelPermitResponse(travelData: ITravelPermit): ITravelPermitResponse {
        return {
            id: travelData._id,
            status: travelData.status,
            account_Code: travelData.accountCode,
            requisition_Date: travelData.requisitionDate,
            mode_Of_Travel: travelData.modeOfTravel,
            destination: travelData.destination,
            reason_For_Travel: travelData.reasonForTravel,
            departure_Date: travelData.departureDate,
            return_Date: travelData.returnDate,
            personal_Vehicle_Number: travelData.personalVehicleNumber,
            lodging_Cost: travelData.lodgingCost,
            meals_Cost: travelData.mealsCost,
            conference_Fees: travelData.conferenceFees,
            is_Credit_Card_Needed: travelData.isCreditCardNeeded,
            permission_To_Exceed_Daily_Hotel_And_Meal_Maiximum: travelData.permissionToExceedDailyHotelAndMealMaximum,
            permission_For_Out_Of_State_Travel: travelData.permissionForOutOfStateTravel
        };
    }
}

import { getSearchFilterWithRegexAll } from 'src/@core/utils/query-filter.utils';
import { LeaveApplicationDto, LeaveResponseDto } from './dto/leave-application.dto';
import { AuthService } from 'src/components/auth/auth.service';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { ILeaveApplication, ILeaveApplicationResponse, ILeaveResponse } from './interfaces/leave-application.interface';
import { Request } from 'express';
import { LEAVE_APPLICATION_CONSTANT } from 'src/@core/constants/api-error-constants';
import { getKeyByValue } from 'src/@core/utils/common.utils';
import { LEAVE_STATUS } from 'src/@core/constants';

@Injectable()
export class LeaveApplicationService {
    constructor(@InjectModel('LeaveApplication') private readonly LeaveApplicationModel: PaginateModel<ILeaveApplication>, private authService: AuthService) {}

    async createLeave(createDto: LeaveApplicationDto, req: Request, file: any): Promise<ILeaveApplicationResponse> {
        try {
            const loggedInUser = this.authService.getLoggedInUserInformationFromRequest(req);
            if (!file || !file.filename) {
                throw new BadRequestException(LEAVE_APPLICATION_CONSTANT.SIGNATURE_IS_REQUIRED);
            }
            createDto.addedBy = loggedInUser.id;
            createDto.company = <string>loggedInUser.defaultCompany.companyId;
            createDto.signature = file.filename;
            const leaveApplication = new this.LeaveApplicationModel(createDto);
            leaveApplication.leaveFrom = new Date(createDto.leaveFrom);
            leaveApplication.leaveTo = new Date(createDto.leaveTo);
            const savedLeave = await leaveApplication.save();
            return this.buildLeaveResponse(savedLeave);
        } catch (err) {
            throw new BadRequestException(err, LEAVE_APPLICATION_CONSTANT.UNABLE_TO_CREATE_LEAVE_APPLICATION);
        }
    }

    async findAllLeaves(req: Request): Promise<PaginateResult<ILeaveApplicationResponse>> {
        try {
            const loggedInUserDetail = this.authService.getLoggedInUserInformationFromRequest(req);
            const { page, limit, status, search, searchValue, deleted, isStaff } = req.query;
            const searchQuery = search && search === 'true' && searchValue ? getSearchFilterWithRegexAll(searchValue, ['numberOfHours', 'leaveType']) : {};
            let query;
            const verified = status && status.toString().toUpperCase() === 'TRUE' ? true : false;
            if (deleted && deleted.toString().toUpperCase() === 'TRUE') {
                query = { isDeleted: true };
            } else {
                verified ? (query = { $or: [{ isDeleted: false }, { isDeleted: null }], status: true }) : (query = { $or: [{ isDeleted: false }, { isDeleted: null }], status: false });
            }

            if (isStaff && isStaff.toString().toUpperCase() === 'TRUE') {
                query = {
                    ...query,
                    addedBy: loggedInUserDetail.id
                };
            }

            query = {
                ...query,
                company: loggedInUserDetail.defaultCompany.companyId
            };

            const options = {
                select: 'addedBy company status leaveType isDeleted leaveFrom leaveTo numberOfHours acceptedDate response acceptedBy createdAt',
                sort: { updatedAt: -1 },
                lean: true,
                limit: Number(limit),
                page: Number(page)
            };
            const leaveApplications = await this.LeaveApplicationModel.paginate({ ...query, ...searchQuery }, options);
            return this.buildPaginateLeave(leaveApplications);
        } catch (error) {
            throw new BadRequestException(error, LEAVE_APPLICATION_CONSTANT.UNABLE_TO_FIND_LEAVE_APPLICATION);
        }
    }

    async findLeaveApplicationById(id: string, buildResponse = true): Promise<ILeaveApplicationResponse | ILeaveApplication> {
        const leave = await this.LeaveApplicationModel.findById(id);
        if (!leave) {
            throw new NotFoundException(LEAVE_APPLICATION_CONSTANT.UNABLE_TO_FIND_LEAVE_APPLICATION);
        }
        return buildResponse ? this.buildLeaveResponse(leave) : leave;
    }

    async updateLeave(id: string, updateDto: LeaveApplicationDto, file: any): Promise<ILeaveApplicationResponse> {
        if (!file || !file.filename) {
            throw new BadRequestException(LEAVE_APPLICATION_CONSTANT.SIGNATURE_IS_REQUIRED);
        }
        const leaveApplication = <ILeaveApplication>await this.findLeaveApplicationById(id, false);
        leaveApplication.signature = file.filename;
        leaveApplication.leaveFrom = new Date(updateDto.leaveFrom);
        leaveApplication.leaveTo = new Date(updateDto.leaveTo);
        leaveApplication.numberOfHours = updateDto.numberOfHours;
        leaveApplication.leaveType = updateDto.leaveType;
        const updatedLeave = await leaveApplication.save();
        return this.buildLeaveResponse(updatedLeave);
    }

    async respondLeaveStatus(id: string, req: Request, leaveResponseDto: LeaveResponseDto, file: any): Promise<ILeaveApplicationResponse> {
        if (!file || !file.filename) {
            throw new BadRequestException(LEAVE_APPLICATION_CONSTANT.SIGNATURE_IS_REQUIRED);
        }
        const leaveStatus = leaveResponseDto.response ? getKeyByValue(LEAVE_STATUS, leaveResponseDto.response) : null;
        console.log(102, leaveStatus);
        const loggedInUserDetail = this.authService.getLoggedInUserInformationFromRequest(req);
        const leaveApplication = <ILeaveApplication>await this.findLeaveApplicationById(id, false);
        if (leaveApplication && leaveApplication.response.length) {
            const existingResponder = leaveApplication.response.find((user) => user.respondedBy.toString() === loggedInUserDetail.id.toString());
            console.log(107, loggedInUserDetail.id);
            if (existingResponder) {
                existingResponder.leaveStatus = leaveStatus ? LEAVE_STATUS[leaveStatus] : existingResponder.leaveStatus;
                existingResponder.comment = leaveResponseDto.comment;
                return this.buildLeaveResponse(await leaveApplication.save());
            } else {
                const responseData = this.prepareLeaveResponseData(leaveResponseDto, leaveStatus, loggedInUserDetail.id, file.filename);
                leaveApplication.response.push(responseData);
                return this.buildLeaveResponse(await leaveApplication.save());
            }
        } else {
            const responseData = this.prepareLeaveResponseData(leaveResponseDto, leaveStatus, loggedInUserDetail.id, file.filename);
            leaveApplication.response.push(responseData);
            return this.buildLeaveResponse(await leaveApplication.save());
        }
    }

    prepareLeaveResponseData(leaveResponseDto: LeaveResponseDto, leaveStatus: string, respondedBy: string, signature: string): ILeaveResponse {
        return {
            leaveStatus: leaveStatus ? LEAVE_STATUS[leaveStatus] : LEAVE_STATUS.PENDING,
            date: new Date(),
            respondedBy: respondedBy,
            comment: leaveResponseDto.comment ? leaveResponseDto.comment : null,
            signature
        };
    }

    async changeLeaveStatus(id: string, req: Request): Promise<ILeaveApplicationResponse> {
        const { status } = req.query;
        if (!status) {
            throw new BadRequestException(LEAVE_APPLICATION_CONSTANT.STATUS_IS_REQUIRED);
        }
        const leave = <ILeaveApplication>await this.findLeaveApplicationById(id, false);
        if (status && status.toString().toUpperCase() === 'TRUE') {
            leave.status = true;
            if (leave.isDeleted) {
                leave.isDeleted = false;
            }
        }
        if (status && status.toString().toUpperCase() === 'FALSE') {
            leave.status = false;
        }
        return this.buildLeaveResponse(await leave.save());
    }

    async deleteLeave(id: string): Promise<ILeaveApplicationResponse> {
        const leave = <ILeaveApplication>await this.findLeaveApplicationById(id, false);
        leave.isDeleted = true;
        return this.buildLeaveResponse(await leave.save());
    }

    buildPaginateLeave(leaveApplicationData: PaginateResult<ILeaveApplication>): PaginateResult<ILeaveApplicationResponse> {
        return {
            docs: leaveApplicationData.docs.map((leave) => this.buildLeaveResponse(leave)),
            page: leaveApplicationData.page,
            pages: leaveApplicationData?.pages,
            limit: leaveApplicationData.limit,
            total: leaveApplicationData.total,
            offset: leaveApplicationData?.offset
        };
    }

    buildLeaveResponse(leaveData: ILeaveApplication): ILeaveApplicationResponse {
        return {
            id: leaveData._id,
            signature: leaveData.signature,
            status: leaveData.status,
            leave_From: leaveData.leaveFrom,
            leave_To: leaveData.leaveTo,
            number_Of_Hours: leaveData.numberOfHours,
            response: leaveData.response && leaveData.response.length ? leaveData.response.map((leave) => this.buildLeaveResult(leave)) : null,
            leave_Type: leaveData.leaveType || null,
            applied_Date: leaveData.createdAt
        };
    }

    buildLeaveResult(leaveResponse: ILeaveResponse) {
        return {
            leave_status: leaveResponse.leaveStatus,
            date: leaveResponse.date,
            comment: leaveResponse.comment,
            signature: leaveResponse.signature
        };
    }
}

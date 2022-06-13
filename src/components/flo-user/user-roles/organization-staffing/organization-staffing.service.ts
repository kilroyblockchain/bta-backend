import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { StaffingInterface } from './interfaces/organization-staffing.interface';
import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { OrganizationUnitService } from '../organization-unit/organization-unit.service';
import { ORGANIZATION_STAFFING_CONSTANT } from 'src/@core/constants/api-error-constants';
import { OrganizationStaffResponse, CreateStaffingDto } from './dto';
import { PaginatedDto } from 'src/@core/response/dto';

@Injectable()
export class OrganizationStaffingService {
    constructor(
        @InjectModel('Staffing')
        private readonly StaffModel: PaginateModel<StaffingInterface>,
        @Inject(forwardRef(() => OrganizationUnitService))
        private unitService: OrganizationUnitService
    ) {}

    async createNewStaffing(newStaff: CreateStaffingDto): Promise<OrganizationStaffResponse> {
        const logger = new Logger(OrganizationStaffingService.name + '-createNewStaffing');
        try {
            const staff = await new this.StaffModel(newStaff).save();
            return this.buildStaffingResponse(staff);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getStaffingByOrganizationUnitId(unitId: string): Promise<OrganizationStaffResponse[]> {
        const logger = new Logger(OrganizationStaffingService.name + '-getStaffingByOrganizationUnitId');
        try {
            const staffs = await this.StaffModel.find({
                organizationUnitId: unitId,
                status: true
            });
            return staffs.map((staff) => this.buildStaffingResponse(staff));
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getStaffingById(id: string): Promise<OrganizationStaffResponse> {
        const logger = new Logger(OrganizationStaffingService.name + '-getStaffingById');
        try {
            const staff = await this.StaffModel.findOne({
                _id: id,
                status: true
            }).exec();
            if (staff) {
                return this.buildStaffingResponse(staff);
            }
            throw new NotFoundException(ORGANIZATION_STAFFING_CONSTANT.ORGANIZATION_STAFFING_NOT_FOUND);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async updateOrganizationStaffing(id: string, updateStaff: CreateStaffingDto): Promise<OrganizationStaffResponse> {
        const logger = new Logger(OrganizationStaffingService.name + '-updateOrganizationStaffing');
        try {
            const staff = await this.StaffModel.findOne({ _id: id, status: true });
            if (staff) {
                staff.organizationUnitId = updateStaff.organizationUnitId;
                staff.staffingName = updateStaff.staffingName;
                staff.featureAndAccess = updateStaff.featureAndAccess;
                const updatedStaff = await staff.save();
                return this.buildStaffingResponse(updatedStaff);
            }
            throw new NotFoundException(ORGANIZATION_STAFFING_CONSTANT.ORGANIZATION_STAFFING_NOT_FOUND);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async deleteOrganizationStaffing(id: string): Promise<OrganizationStaffResponse> {
        const logger = new Logger(OrganizationStaffingService.name + '-deleteOrganizationStaffing');
        try {
            const deletedStaff = await this.StaffModel.findByIdAndUpdate({ _id: id }, { status: false });
            return this.buildStaffingResponse(deletedStaff);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getAllOrganizationStaffing(req: Request): Promise<PaginatedDto<OrganizationStaffResponse>> {
        const logger = new Logger(OrganizationStaffingService.name + '-getAllOrganizationStaffing');
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const page = req.query.page ? Number(req.query.page) : 1;
            const unitIds = await this.unitService.getUnitIdArrayByCompanyId(req['user'].companyID);
            const query = {
                status: true,
                organizationUnitId: { $in: unitIds }
            };
            const options = {
                select: 'staffingName featureAndAccess organizationUnitId status createdAt updatedAt',
                sort: { updatedAt: -1 },
                populate: {
                    path: 'organizationUnitId featureAndAccess.featureId'
                },
                lean: true,
                limit: limit,
                page: page
            };
            const paginatedDocument = await this.StaffModel.paginate(query, options);
            const paginatedResponse = new PaginatedDto<OrganizationStaffResponse>();
            paginatedResponse.page = paginatedDocument.page;
            paginatedResponse.limit = paginatedDocument.limit;
            paginatedResponse.total = paginatedDocument.total;
            paginatedResponse.docs = paginatedDocument.docs?.map((doc) => this.buildStaffingResponse(doc));
            return paginatedResponse;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async disableAllStaffingByOrganizationUnit(organizationUnitId: string, featureListId: Array<string>): Promise<void> {
        const logger = new Logger(OrganizationStaffingService.name + '-disableAllStaffingByOrganizationUnit');
        try {
            await this.StaffModel.updateOne(
                { organizationUnitId: organizationUnitId },
                {
                    $set: { 'featureAndAccess.$[accessType].accessType': [] }
                },
                {
                    arrayFilters: [{ 'accessType.featureId': { $nin: featureListId } }],
                    multi: true
                }
            );
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async enableOrganizationStaffing(staffingId: string): Promise<OrganizationStaffResponse> {
        const logger = new Logger(OrganizationStaffingService.name + '-enableOrganizationStaffing');
        try {
            const enabledStaff = await this.StaffModel.findByIdAndUpdate({ _id: staffingId }, { status: true });
            return this.buildStaffingResponse(enabledStaff);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async findNameFromArray(data: Array<string>): Promise<Array<OrganizationStaffResponse>> {
        const logger = new Logger(OrganizationStaffingService.name + '-findNameFromArray');
        try {
            const staffs = await this.StaffModel.find({
                _id: { $in: data }
            }).select('staffingName');
            return staffs.map((staff) => this.buildStaffingResponse(staff));
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    buildStaffingResponse(staffDocument: StaffingInterface): OrganizationStaffResponse {
        const logger = new Logger(OrganizationStaffingService.name + '-buildStaffingResponse');
        if (staffDocument) {
            const staffingResponse = new OrganizationStaffResponse();
            staffingResponse._id = staffDocument._id;
            staffingResponse.organizationUnitId = staffDocument.organizationUnitId;
            staffingResponse.staffingName = staffDocument.staffingName;
            staffingResponse.featureAndAccess = staffDocument.featureAndAccess;
            staffingResponse.status = staffDocument.status;
            staffingResponse.createdAt = staffDocument.createdAt;
            staffingResponse.updatedAt = staffDocument.updatedAt;
            return staffingResponse;
        } else {
            logger.log('Organization staff document is undefined / null');
            throw new BadRequestException('Organization staff document is undefined / null');
        }
    }
}

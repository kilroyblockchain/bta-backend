import { Request } from 'express';
import { CreateStaffingDto } from './dto/createorganization-staffing.dto';
import { InjectModel } from '@nestjs/mongoose';
import { StaffingInterface } from './interfaces/organization-staffing.interface';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaginateModel, PaginateResult } from 'mongoose';
import { OrganizationUnitService } from '../organization-unit/organization-unit.service';
import { ORGANIZATION_STAFFING_CONSTANT } from 'src/@core/constants/api-error-constants';

@Injectable()
export class OrganizationStaffingService {
    constructor(
        @InjectModel('Staffing')
        private readonly StaffModel: PaginateModel<StaffingInterface>,
        @Inject(forwardRef(() => OrganizationUnitService))
        private unitService: OrganizationUnitService
    ) {}

    async createNewStaffing(newStaff: CreateStaffingDto): Promise<StaffingInterface> {
        return await new this.StaffModel(newStaff).save();
    }

    async getStaffingByOrganizationUnitId(unitId: string): Promise<StaffingInterface[]> {
        return await this.StaffModel.find({
            organizationUnitId: unitId,
            status: true
        });
    }

    async getStaticStaffingOfTraining() {
        const trainingUnit = await this.unitService.getTrainingOrganizationUnits();
        const trainingStaffings = await this.StaffModel.find({
            organizationUnitId: trainingUnit._id,
            status: true
        });
        return {
            unit: trainingUnit,
            staffs: trainingStaffings
        };
    }

    async getStaffingById(id: string): Promise<StaffingInterface> {
        const staff = await this.StaffModel.findOne({
            _id: id,
            status: true
        }).exec();
        if (staff) {
            return staff;
        }
        throw new NotFoundException(ORGANIZATION_STAFFING_CONSTANT.ORGANIZATION_STAFFING_NOT_FOUND);
    }

    async updateOrganizationStaffing(id: string, updateStaff: CreateStaffingDto): Promise<StaffingInterface> {
        const staff = await this.getStaffingById(id);
        if (staff) {
            staff.organizationUnitId = updateStaff.organizationUnitId;
            staff.staffingName = updateStaff.staffingName;
            staff.featureAndAccess = updateStaff.featureAndAccess;
            return await staff.save();
        }
        throw new NotFoundException(ORGANIZATION_STAFFING_CONSTANT.ORGANIZATION_STAFFING_NOT_FOUND);
    }

    async deleteOrganizationStaffing(id: string): Promise<StaffingInterface> {
        return await this.StaffModel.findByIdAndUpdate({ _id: id }, { status: false });
    }

    async getAllOrganizationStaffing(req: Request): Promise<PaginateResult<StaffingInterface>> {
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
        return await this.StaffModel.paginate(query, options);
    }

    async disableAllStaffingByOrganizationUnit(organizationUnitId: string, featureListId: any): Promise<void> {
        await this.StaffModel.update(
            { organizationUnitId: organizationUnitId },
            {
                $set: { 'featureAndAccess.$[accessType].accessType': [] }
            },
            {
                arrayFilters: [{ 'accessType.featureId': { $nin: featureListId } }],
                multi: true
            }
        );
    }

    async enableOrganizationStaffing(staffingId: string): Promise<StaffingInterface> {
        return await this.StaffModel.findByIdAndUpdate({ _id: staffingId }, { status: true });
    }

    async findNameFromArray(data: any) {
        return await this.StaffModel.find({
            _id: { $in: data }
        }).select('staffingName');
    }
}

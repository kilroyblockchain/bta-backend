import { Request } from 'express';
import { CreateOrganizationUnitDto, OrganizationUnitResponse } from './dto';
import { IOrganizationUnitInterface } from './interfaces/organization-unit.interface';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PaginateModel, Types } from 'mongoose';
import { OrganizationStaffingService } from '../organization-staffing/organization-staffing.service';
import { ORGANIZATION_UNIT_CONSTANT } from 'src/@core/constants/api-error-constants';
import { PaginatedDto } from 'src/@core/response/dto';
import { StaffingInterface } from '../organization-staffing/interfaces/organization-staffing.interface';

@Injectable()
export class OrganizationUnitService {
    constructor(
        @InjectModel('OrganizationUnit')
        private readonly UnitModel: PaginateModel<IOrganizationUnitInterface>,
        @Inject(forwardRef(() => OrganizationStaffingService))
        private readonly staffingService: OrganizationStaffingService
    ) {}

    async createNewOrganizationUnit(newUnit: CreateOrganizationUnitDto): Promise<OrganizationUnitResponse> {
        const logger = new Logger(OrganizationUnitService.name + '-createNewOrganizationUnit');
        try {
            const orgUnit = new this.UnitModel(newUnit);
            return this.buildOrganizationUnitResponse(await orgUnit.save());
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getUnitsByCompanyId(companyId: string, options: Request): Promise<PaginatedDto<OrganizationUnitResponse>> {
        const logger = new Logger(OrganizationUnitService.name + '-getUnitsByCompanyId');
        try {
            const page = options.query.page ? Number(options.query.page) : 1;
            const limit = options.query.limit ? Number(options.query.limit) : 10;
            const { subscriptionType } = options.query;
            const status = options.query?.status === 'true' ? true : false;
            const aggregations = [
                {
                    $lookup: {
                        from: 'staffings',
                        localField: '_id',
                        foreignField: 'organizationUnitId',
                        as: 'staffing_records'
                    }
                },
                {
                    $unwind: {
                        path: '$staffing_records',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ];
            const filter = [
                {
                    $match: {
                        companyID: new Types.ObjectId(companyId),
                        status: status,
                        subscriptionType: subscriptionType
                    }
                }
            ];
            const groupBy = [
                {
                    $group: {
                        _id: '$_id',
                        featureListId: { $first: '$featureListId' },
                        status: { $first: '$status' },
                        companyID: { $first: '$companyID' },
                        unitName: { $first: '$unitName' },
                        createdAt: { $first: '$createdAt' },
                        isMigrated: { $first: '$isMigrated' },
                        updatedAt: { $first: '$updatedAt' },
                        unitDescription: { $first: '$unitDescription' },
                        staffing_records: { $push: '$staffing_records' }
                    }
                }
            ];
            const facets = [
                {
                    $facet: {
                        metadata: [
                            { $count: 'total' },
                            {
                                $addFields: {
                                    page: page ? page : 1,
                                    limit: Number(limit) ? Number(limit) : 10
                                }
                            }
                        ],
                        data: [{ $skip: (page - 1) * limit }, { $limit: limit }]
                    }
                }
            ];
            const aggregate = [...aggregations, ...filter, ...groupBy, ...facets];
            const retrievedData = await this.UnitModel.aggregate(aggregate);
            const data = {
                docs: retrievedData[0].data?.map((unit) => this.buildOrganizationUnitResponse(new this.UnitModel(unit), unit?.staffing_records)) ?? [],
                total: retrievedData[0]?.metadata[0]?.total ? retrievedData[0].metadata[0].total : 0,
                limit: retrievedData[0]?.metadata[0]?.limit ? retrievedData[0].metadata[0].limit : 0,
                page: retrievedData[0]?.metadata[0]?.page ? retrievedData[0].metadata[0].page : 0
            };
            return data;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getUnitIdArrayByCompanyId(companyId: string): Promise<Array<string>> {
        const logger = new Logger(OrganizationUnitService.name + '-getUnitIdArrayByCompanyId');
        try {
            const unitsIds = await this.UnitModel.find({
                companyID: companyId,
                status: true
            }).select('_id');
            return unitsIds.map((id) => id._id);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getOrganizationUnitById(id: string): Promise<OrganizationUnitResponse> {
        const logger = new Logger(OrganizationUnitService.name + '-getOrganizationUnitById');
        try {
            const orgUnit = await this.UnitModel.findOne({ _id: id }).populate('featureListId').exec();
            if (orgUnit) {
                return this.buildOrganizationUnitResponse(orgUnit);
            }
            throw new NotFoundException(ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_NOT_FOUND);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async updateOrganizationUnit(id: string, updateUnit: CreateOrganizationUnitDto): Promise<OrganizationUnitResponse> {
        const logger = new Logger(OrganizationUnitService.name + '-updateOrganizationUnit');
        try {
            const orgUnit = await this.UnitModel.findById(id);
            if (orgUnit) {
                orgUnit.companyID = updateUnit.companyID;
                orgUnit.unitName = updateUnit.unitName;
                orgUnit.featureListId = updateUnit.featureListId;
                orgUnit.unitDescription = updateUnit.unitDescription;
                await this.staffingService.disableAllStaffingByOrganizationUnit(id, orgUnit.featureListId);
                return this.buildOrganizationUnitResponse(await orgUnit.save());
            }
            throw new NotFoundException(ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_NOT_FOUND);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async enableOrganizationUnit(unitId: string): Promise<OrganizationUnitResponse> {
        const logger = new Logger(OrganizationUnitService.name + '-enableOrganizationUnit');
        try {
            return this.buildOrganizationUnitResponse(await this.UnitModel.findByIdAndUpdate({ _id: unitId }, { status: true }));
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async deleteOrganizationUnit(id: string): Promise<OrganizationUnitResponse> {
        const logger = new Logger(OrganizationUnitService.name + '-deleteOrganizationUnit');
        try {
            return this.buildOrganizationUnitResponse(await this.UnitModel.findByIdAndUpdate({ _id: id }, { status: false }));
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getAllOrganizationUnits(req: Request, defaultSubscriptionType: string): Promise<OrganizationUnitResponse[]> {
        const logger = new Logger(OrganizationUnitService.name + '-getAllOrganizationUnits');
        try {
            const user = req['user'];
            const orgUnits = await this.UnitModel.find({
                companyID: user.company.find((defCompany) => defCompany.default).companyId,
                status: true,
                subscriptionType: defaultSubscriptionType
            });
            return orgUnits.map((orgUnit) => this.buildOrganizationUnitResponse(orgUnit));
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    buildOrganizationUnitResponse(orgUnitDocument: IOrganizationUnitInterface, staffingList?: StaffingInterface[]): OrganizationUnitResponse {
        const logger = new Logger(OrganizationUnitService.name + '-buildOrganizationUnitResponse');
        if (orgUnitDocument) {
            const orgUnitResponse = new OrganizationUnitResponse();
            orgUnitResponse._id = orgUnitDocument._id;
            orgUnitResponse.companyID = orgUnitDocument.companyID;
            orgUnitResponse.unitName = orgUnitDocument.unitName;
            orgUnitResponse.unitDescription = orgUnitDocument.unitDescription;
            orgUnitResponse.subscriptionType = orgUnitDocument.subscriptionType;
            orgUnitResponse.featureListId = orgUnitDocument.featureListId;
            orgUnitResponse.status = orgUnitDocument.status;
            orgUnitResponse.isMigrated = orgUnitDocument.isMigrated;
            orgUnitResponse.createdAt = new Date(orgUnitDocument.createdAt?.toString());
            orgUnitResponse.updatedAt = new Date(orgUnitDocument.updatedAt?.toString());
            orgUnitResponse.staffing_records = staffingList?.map((staff) => this.staffingService.buildStaffingResponse(staff)) ?? [];
            return orgUnitResponse;
        } else {
            logger.log('Organization unit is undefined / null');
            throw new BadRequestException('Organization unit is undefined / null');
        }
    }
}

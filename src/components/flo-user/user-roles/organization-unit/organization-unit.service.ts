import { Request } from 'express';
import { CreateOrganizationUnitDto } from './dto/createorganization-unit.dto';
import { IOrganizationUnitInterface } from './interfaces/organization-unit.interface';
import { InjectModel } from '@nestjs/mongoose';
import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PaginateModel, PaginateResult, Types } from 'mongoose';
import { OrganizationStaffingService } from '../organization-staffing/organization-staffing.service';
import { STATIC_ORGANIZATION_ID } from 'src/@core/constants/objectId.constant';
import { ORGANIZATION_UNIT_CONSTANT } from 'src/@core/constants/api-error-constants';

@Injectable()
export class OrganizationUnitService {
    constructor(
        @InjectModel('OrganizationUnit')
        private readonly UnitModel: PaginateModel<IOrganizationUnitInterface>,
        @Inject(forwardRef(() => OrganizationStaffingService))
        private readonly staffingService: OrganizationStaffingService
    ) {}

    async createNewOrganizationUnit(newUnit: CreateOrganizationUnitDto): Promise<IOrganizationUnitInterface> {
        const logger = new Logger(OrganizationUnitService.name + '-createNewOrganizationUnit');
        try {
            const orgUnit = new this.UnitModel(newUnit);
            return await orgUnit.save();
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getUnitsByCompanyId(companyId: string, options: Request): Promise<PaginateResult<IOrganizationUnitInterface>> {
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
                docs: retrievedData[0].data,
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

    async getUnitIdArrayByCompanyId(companyId: string): Promise<Array<IOrganizationUnitInterface>> {
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

    async getOrganizationUnitById(id: string): Promise<IOrganizationUnitInterface> {
        const logger = new Logger(OrganizationUnitService.name + '-getOrganizationUnitById');
        try {
            const orgUnit = await this.UnitModel.findOne({ _id: id }).populate('featureListId').exec();
            if (orgUnit) {
                return orgUnit;
            }
            throw new NotFoundException(ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_NOT_FOUND);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async updateOrganizationUnit(id: string, updateUnit: CreateOrganizationUnitDto): Promise<IOrganizationUnitInterface> {
        const logger = new Logger(OrganizationUnitService.name + '-updateOrganizationUnit');
        try {
            const orgUnit = await this.getOrganizationUnitById(id);
            if (orgUnit) {
                orgUnit.companyID = updateUnit.companyID;
                orgUnit.unitName = updateUnit.unitName;
                orgUnit.featureListId = updateUnit.featureListId;
                orgUnit.unitDescription = updateUnit.unitDescription;
                await this.staffingService.disableAllStaffingByOrganizationUnit(id, orgUnit.featureListId);
                return await orgUnit.save();
            }
            throw new NotFoundException(ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_NOT_FOUND);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async enableOrganizationUnit(unitId: string): Promise<IOrganizationUnitInterface> {
        const logger = new Logger(OrganizationUnitService.name + '-enableOrganizationUnit');
        try {
            return await this.UnitModel.findByIdAndUpdate({ _id: unitId }, { status: true });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async deleteOrganizationUnit(id: string): Promise<IOrganizationUnitInterface> {
        const logger = new Logger(OrganizationUnitService.name + '-deleteOrganizationUnit');
        try {
            return await this.UnitModel.findByIdAndUpdate({ _id: id }, { status: false });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getAllOrganizationUnits(req: Request, defaultSubscriptionType: string): Promise<IOrganizationUnitInterface[]> {
        const logger = new Logger(OrganizationUnitService.name + '-getAllOrganizationUnits');
        try {
            const user = req['user'];
            return await this.UnitModel.find({
                companyID: user.company.find((defCompany) => defCompany.default).companyId,
                status: true,
                subscriptionType: defaultSubscriptionType
            });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getTrainingOrganizationUnits(): Promise<IOrganizationUnitInterface> {
        const logger = new Logger(OrganizationUnitService.name + '-getTrainingOrganizationUnits');
        try {
            return await this.UnitModel.findOne({
                companyID: STATIC_ORGANIZATION_ID.toHexString()
            });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}

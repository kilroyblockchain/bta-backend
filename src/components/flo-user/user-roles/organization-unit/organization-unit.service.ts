import { Request } from 'express';
import { CreateOrganizationUnitDto } from './dto/createorganization-unit.dto';
import { IOrganizationUnitInterface } from './interfaces/organization-unit.interface';
import { InjectModel } from '@nestjs/mongoose';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
        const orgUnit = new this.UnitModel(newUnit);
        return await orgUnit.save();
    }

    async getUnitsByCompanyId(companyId: string, options: Request): Promise<PaginateResult<IOrganizationUnitInterface>> {
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
    }

    async getUnitIdArrayByCompanyId(companyId: string): Promise<Array<IOrganizationUnitInterface>> {
        const unitsIds = await this.UnitModel.find({
            companyID: companyId,
            status: true
        }).select('_id');
        return unitsIds.map((id) => id._id);
    }

    async getOrganizationUnitById(id: string): Promise<IOrganizationUnitInterface> {
        const orgUnit = await this.UnitModel.findOne({ _id: id }).populate('featureListId').exec();
        if (orgUnit) {
            return orgUnit;
        }
        throw new NotFoundException(ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_NOT_FOUND);
    }

    async updateOrganizationUnit(id: string, updateUnit: CreateOrganizationUnitDto): Promise<IOrganizationUnitInterface> {
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
    }

    async enableOrganizationUnit(unitId: string): Promise<IOrganizationUnitInterface> {
        return await this.UnitModel.findByIdAndUpdate({ _id: unitId }, { status: true });
    }

    async deleteOrganizationUnit(id: string): Promise<IOrganizationUnitInterface> {
        return await this.UnitModel.findByIdAndUpdate({ _id: id }, { status: false });
    }

    async getAllOrganizationUnits(req: Request, defaultSubscriptionType: string): Promise<IOrganizationUnitInterface[]> {
        const user = req['user'];
        return await this.UnitModel.find({
            companyID: user.company.find((defCompany) => defCompany.default).companyId,
            status: true,
            subscriptionType: defaultSubscriptionType
        });
    }

    async getTrainingOrganizationUnits(): Promise<IOrganizationUnitInterface> {
        return await this.UnitModel.findOne({
            companyID: STATIC_ORGANIZATION_ID.toHexString()
        });
    }
}

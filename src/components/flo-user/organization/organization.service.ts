import { CreateOrganizationDto } from './dto/create-organization.dto';
import { HttpException, Injectable, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrganizationResponse, IOrganization, ICompanyDto, IOrganizationInit, ISubscription } from './interfaces/organization.interface';
import { Request } from 'express';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { CountryService } from '../country/country.service';
import { ROLE } from 'src/@core/constants';
import { OrganizationBcService } from './organization-bc.service';
import { BC_STATUS } from 'src/@core/constants/bc-status.enum';
import { BC_PAYLOAD } from 'src/@core/constants/bc-constants/bc-payload.constant';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { BcUserDto } from 'src/@core/common/bc-user.dto';
import { ORGANIZATION_CONSTANT, USER_CONSTANT } from 'src/@core/constants/api-error-constants';
@Injectable()
export class OrganizationService {
    constructor(
        @InjectModel('Organization')
        private readonly organizationModel: Model<IOrganization>,
        private readonly countryService: CountryService,
        private readonly organizationBcService: OrganizationBcService
    ) {}

    async create(req: Request, logoName: string, createOrganizationDto: CreateOrganizationDto): Promise<IOrganizationResponse> {
        const organization = new this.organizationModel(createOrganizationDto);
        try {
            organization.companyLogo = logoName;
            await organization.save();
            return this.buildOrganizationInfo(organization);
        } catch (e) {
            if (e.code === 11000 && e.keyPattern.companyName) {
                const message = `${e.keyValue.companyName} has already been registered`;
                throw new HttpException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        error: message,
                        message: message
                    },
                    HttpStatus.BAD_REQUEST
                );
            }
        }
    }

    async update(organizationId: string, logoName: string, updateOrganizationDto: UpdateOrganizationDto, req: Request): Promise<IOrganization> {
        try {
            const currentOrganization = await this.organizationModel.findById(organizationId).exec();
            await currentOrganization.updateOne({
                companyName: updateOrganizationDto.companyName,
                country: updateOrganizationDto.country || null,
                state: updateOrganizationDto.state || null,
                city: updateOrganizationDto.city || null,
                address: updateOrganizationDto.address || '',
                zipCode: updateOrganizationDto.zipCode || '',
                companyLogo: logoName ? logoName : currentOrganization.companyLogo
            });
        } catch (err) {
            if (err.code === 11000 && updateOrganizationDto.companyName) {
                throw new BadRequestException([ORGANIZATION_CONSTANT.COMPANY_NAME_HAS_ALREADY_BEEN_REGISTERED, updateOrganizationDto.companyName]);
            } else {
                throw new BadRequestException([ORGANIZATION_CONSTANT.FAILED_TO_UPDATE_ORGANIZATION, err]);
            }
        }
        const updatedOrg = await this.organizationModel.findById(organizationId).populate({ path: 'country state', select: 'name' }).exec();

        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const organization = await this.organizationModel.findById(organizationId).exec();
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.organizationBcService.storeOrganizationBC(organization, bcUserDto, BC_PAYLOAD.UPDATE_ORGANIZATION);
            const blockchainVerified = await this.organizationBcService.getBlockchainVerified(organization, bcUserDto);
            return { ...updatedOrg['_doc'], blockchainVerified };
        }
        return updatedOrg;
    }

    buildEmptyOrganization(registerData: ICompanyDto): IOrganizationInit {
        return {
            companyName: registerData.companyName,
            country: registerData.companyCountry || null,
            state: registerData.companyState || null,
            city: registerData.companyCity || '',
            address: registerData.companyAddress || '',
            zipCode: registerData.companyZipCode || '',
            companyLogo: registerData.companyLogo || '',
            image: registerData.image || null,
            subscription: [{ type: registerData.subscriptionType, status: false }]
        };
    }

    async createOrganization(req: Request, logoName: string, createOrganizationDto: CreateOrganizationDto): Promise<IOrganization> {
        const organization = new this.organizationModel(createOrganizationDto);
        organization.companyLogo = logoName;
        return organization;
    }

    // Function that is used for all internal calls (No Blockchain Verified Needed)
    async findOrganizationById(id: string): Promise<IOrganization> {
        return await this.organizationModel.findById(id).exec();
    }

    // Function Created For Controller to show Blockchain Verified
    async findOrganizationByIdBcVerified(id: string, req: Request): Promise<IOrganization> {
        const orgDetail = await this.organizationModel.findById(id).exec();
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            const blockchainVerified = await this.organizationBcService.getBlockchainVerified(orgDetail, bcUserDto);
            return { ...orgDetail['_doc'], blockchainVerified };
        }
        return orgDetail;
    }

    async isOrganizationNameUnique(name: string): Promise<boolean> {
        const user = await this.organizationModel.findOne({ companyName: name });
        if (user) {
            return false;
        }
        return true;
    }

    async getOrganizationByName(name: string): Promise<IOrganization> {
        return await this.organizationModel.findOne({ companyName: name });
    }

    async findAllOrganization(req: Request): Promise<Array<IOrganization>> {
        const { ownOrganizationId } = req.query;
        return await this.organizationModel.find({
            _id: { $ne: ownOrganizationId }
        });
    }

    async findAllOrganizationName(): Promise<Array<string>> {
        const orgNames = await this.organizationModel.find().select('companyName');
        const companyNames = [];
        orgNames.forEach((element) => {
            companyNames.push(element.companyName);
        });
        return companyNames;
    }

    async updateOrganizationStatus(companyId: string, subscriptionType: string, status: boolean): Promise<void> {
        await this.organizationModel.updateOne(
            { _id: companyId, 'subscription.type': subscriptionType },
            {
                $set: {
                    'subscription.$.status': status,
                    isDeleted: false
                }
            }
        );
    }

    async addNonexistingSubscription(companyId: string, subscriptionType: string): Promise<void> {
        const key = Object.keys(ROLE).find((key) => ROLE[key] === subscriptionType);
        const company = await this.organizationModel.findById(companyId);
        if (company) {
            const exists = company.subscription.filter((comp) => comp.type === subscriptionType);
            if (!exists.length) {
                await this.organizationModel.updateOne(
                    {
                        _id: companyId
                    },
                    {
                        $push: {
                            subscription: {
                                type: ROLE[`${key}`],
                                status: true
                            }
                        }
                    }
                );
            }
        }
    }

    async addSubscription(companyId: string, subscriptionType: Array<string>): Promise<void> {
        let newSubscription = [];
        let removedSubscription = [];
        const company = await this.organizationModel.findById(companyId);
        const currentSubscription = company.subscription;
        newSubscription = subscriptionType.filter((subType) => !currentSubscription.some((com) => com.type === subType));
        const removedSubscriptionData = currentSubscription.filter((com) => !subscriptionType.includes(com.type) && com.type !== 'super-admin');
        removedSubscription = removedSubscriptionData.map((company) => company.type);
        if (newSubscription.length || removedSubscription.length) {
            await this.organizationModel.updateOne(
                {
                    _id: companyId
                },
                {
                    $pullAll: {
                        subscription: removedSubscriptionData
                    }
                }
            );
            await this.organizationModel.findOneAndUpdate(
                {
                    _id: companyId
                },
                {
                    $push: {
                        subscription: newSubscription.map((subscriptionType) => {
                            return {
                                status: true,
                                type: subscriptionType
                            };
                        }) as Array<ISubscription>
                    }
                },
                {
                    new: true,
                    useFindAndModify: false
                }
            );
        }
    }

    async rejectOrganization(organizationId: string): Promise<IOrganization> {
        try {
            const rejectedOrganization = await this.organizationModel.findByIdAndUpdate(
                organizationId,
                {
                    isRejected: true
                },
                { new: true }
            );
            return rejectedOrganization;
        } catch (err) {
            throw new BadRequestException(USER_CONSTANT.FAILED_TO_REJECT_ORGANIZATION);
        }
    }

    async allowOrganization(organizationId: string): Promise<IOrganization> {
        try {
            const allowedOrganization = await this.organizationModel.findByIdAndUpdate(
                organizationId,
                {
                    isRejected: false
                },
                { new: true }
            );
            return allowedOrganization;
        } catch (err) {
            throw new BadRequestException(USER_CONSTANT.FAILED_TO_REMOVE_REJECT_FLAG);
        }
    }

    private buildOrganizationInfo(org): IOrganizationResponse {
        return {
            id: org._id,
            companyName: org.companyName,
            country: org.country,
            state: org.state,
            city: org.city,
            address: org.address,
            zipCode: org.zipCode,
            companyLogo: org.companyLogo,
            subscription: org.subscription
        };
    }

    /**
     * Find Organization Blockchain History
     * Calls getOrganizationBcHistory function of organization blockchain service. If organization not found, throws an error.
     *
     *
     * @param {Request} options - Option of type Request
     * @param {string} organizationId - Id of the organization to get the history from blockchain
     *
     *
     **/
    async findOrganizationBlockchainHistory(options: Request, organizationId: string): Promise<any> {
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = options['user']._id;
            bcUserDto.company = options['user'].company.find((defaultCompany) => defaultCompany.default);
            const blockchainHistory = await this.organizationBcService.getOrganizationBcHistory(bcUserDto, organizationId);
            if (blockchainHistory.length == 0) {
                throw new NotFoundException(BC_ERROR_RESPONSE.BLOCKCHAIN_HISTORY_NOT_FOUND);
            }
            const organizationData = await this.findOrganizationById(organizationId);
            return {
                blockchainHistory,
                organizationData
            };
        } else {
            throw new BadRequestException(BC_ERROR_RESPONSE.BLOCKCHAIN_NOT_ENABLED);
        }
    }
}

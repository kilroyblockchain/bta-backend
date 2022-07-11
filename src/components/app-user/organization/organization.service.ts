import { CreateOrganizationDto } from './dto/create-organization.dto';
import { HttpException, Injectable, HttpStatus, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrganizationResponse, IOrganization, ICompanyDto, IOrganizationInit, ISubscription } from './interfaces/organization.interface';
import { Request } from 'express';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ROLE } from 'src/@core/constants';
import { ORGANIZATION_CONSTANT, USER_CONSTANT } from 'src/@core/constants/api-error-constants';
@Injectable()
export class OrganizationService {
    constructor(
        @InjectModel('Organization')
        private readonly organizationModel: Model<IOrganization>
    ) {}

    async create(req: Request, logoName: string, createOrganizationDto: CreateOrganizationDto): Promise<IOrganizationResponse> {
        const logger = new Logger(OrganizationService.name + '-create');
        const organization = new this.organizationModel(createOrganizationDto);
        try {
            organization.companyLogo = logoName;
            await organization.save();
            return this.buildOrganizationInfo(organization);
        } catch (e) {
            logger.error(e);
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

    async update(organizationId: string, logoName: string, updateOrganizationDto: UpdateOrganizationDto): Promise<IOrganization> {
        const logger = new Logger(OrganizationService.name + '-update');
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
            logger.error(err);
            if (err.code === 11000 && updateOrganizationDto.companyName) {
                throw new BadRequestException([ORGANIZATION_CONSTANT.COMPANY_NAME_HAS_ALREADY_BEEN_REGISTERED, updateOrganizationDto.companyName]);
            } else {
                throw new BadRequestException([ORGANIZATION_CONSTANT.FAILED_TO_UPDATE_ORGANIZATION, err]);
            }
        }
        try {
            return await this.organizationModel.findById(organizationId).populate({ path: 'country state', select: 'name' }).exec();
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    buildEmptyOrganization(registerData: ICompanyDto): IOrganizationInit {
        const logger = new Logger(OrganizationService.name + '-buildEmptyOrganization');
        try {
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
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async createOrganization(req: Request, logoName: string, createOrganizationDto: CreateOrganizationDto): Promise<IOrganization> {
        const logger = new Logger(OrganizationService.name + '-createOrganization');
        try {
            const organization = new this.organizationModel(createOrganizationDto);
            organization.companyLogo = logoName;
            return organization;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    // Function that is used for all internal calls (No Blockchain Verified Needed)
    async findOrganizationById(id: string): Promise<IOrganization> {
        const logger = new Logger(OrganizationService.name + '-findOrganizationById');
        try {
            return await this.organizationModel.findById(id).exec();
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    // Function Created For Controller to show Blockchain Verified
    async findOrganizationByIdBcVerified(id: string): Promise<IOrganization> {
        const logger = new Logger(OrganizationService.name + '-findOrganizationByIdBcVerified');
        try {
            return await this.organizationModel.findById(id).exec();
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async isOrganizationNameUnique(name: string): Promise<boolean> {
        const logger = new Logger(OrganizationService.name + '-isOrganizationNameUnique');
        try {
            const user = await this.organizationModel.findOne({ companyName: name });
            if (user) {
                return false;
            }
            return true;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getOrganizationByName(name: string): Promise<IOrganization> {
        const logger = new Logger(OrganizationService.name + '-getOrganizationByName');
        try {
            return await this.organizationModel.findOne({ companyName: name });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async findAllOrganization(req: Request): Promise<Array<IOrganization>> {
        const logger = new Logger(OrganizationService.name + '-findAllOrganization');
        try {
            const { ownOrganizationId } = req.query;
            return await this.organizationModel.find({
                _id: { $ne: ownOrganizationId }
            });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async findAllOrganizationName(): Promise<Array<string>> {
        const logger = new Logger(OrganizationService.name + '-findAllOrganizationName');
        try {
            const orgNames = await this.organizationModel.find().select('companyName');
            const companyNames = [];
            orgNames.forEach((element) => {
                companyNames.push(element.companyName);
            });
            return companyNames;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async updateOrganizationStatus(companyId: string, subscriptionType: string, status: boolean): Promise<void> {
        const logger = new Logger(OrganizationService.name + '-updateOrganizationStatus');
        try {
            await this.organizationModel.updateOne(
                { _id: companyId, 'subscription.type': subscriptionType },
                {
                    $set: {
                        'subscription.$.status': status,
                        isDeleted: false
                    }
                }
            );
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async addNonexistingSubscription(companyId: string, subscriptionType: string): Promise<void> {
        const logger = new Logger(OrganizationService.name + '-addNonexistingSubscription');
        try {
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
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async addSubscription(companyId: string, subscriptionType: Array<string>): Promise<void> {
        const logger = new Logger(OrganizationService.name + '-addSubscription');
        try {
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
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async rejectOrganization(organizationId: string): Promise<IOrganization> {
        const logger = new Logger(OrganizationService.name + '-rejectOrganization');
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
            logger.error(err);
            throw new BadRequestException(USER_CONSTANT.FAILED_TO_REJECT_ORGANIZATION);
        }
    }

    async allowOrganization(organizationId: string): Promise<IOrganization> {
        const logger = new Logger(OrganizationService.name + '-allowOrganization');
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
            logger.error(err);
            throw new BadRequestException(USER_CONSTANT.FAILED_TO_REMOVE_REJECT_FLAG);
        }
    }

    private buildOrganizationInfo(org): IOrganizationResponse {
        const logger = new Logger(OrganizationService.name + '-buildOrganizationInfo');
        try {
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
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}

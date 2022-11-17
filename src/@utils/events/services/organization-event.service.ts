import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { ROLE } from 'src/@core/constants';
import { CreateStaffingDto } from 'src/components/app-user/user-roles/organization-staffing/dto';
import { OrganizationStaffingService } from 'src/components/app-user/user-roles/organization-staffing/organization-staffing.service';
import { CreateOrganizationUnitDto } from 'src/components/app-user/user-roles/organization-unit/dto';
import { OrganizationUnitService } from 'src/components/app-user/user-roles/organization-unit/organization-unit.service';
import { UserService } from 'src/components/app-user/user/user.service';
import {
    AI_ENGINEER,
    MLOps_ENGINEER,
    MODEL_MONITORING_STAFFING_ID,
    MODEL_REVIEWS_STAFFING_ID,
    MODEL_VERSION_STAFFING_ID,
    ORGANIZATION_DETAIL_STAFFING_ID,
    PERSONAL_DETAIL_STAFFING_ID,
    PROJECT_STAFFING_ID,
    PROJECT_PURPOSE_STAFFING_ID,
    STAKEHOLDER,
    UNIT_DESCRIPTION,
    UNIT_NAME,
    BC_NODE_INFO_ID,
    CHANNELS_DETAILS_ID,
    ORACLE_BUCKET_URL,
    MANAGE_ALL_USER_STAFFING_ID,
    APPLICATION_LOGS_STAFFING_ID,
    ORGANIZATION_UNIT_STAFFING_ID,
    ORGANIZATION_USER_STAFFING_ID,
    USER_ACTIVITY_STAFFING_ID,
    MANAGE_BLOCKED_COMPANY_USERS_STAFFING_ID,
    CHANGE_USER_PASSWORD_STAFFING_ID,
    ORGANIZATION_STAFFING_STAFFING_ID
} from '../constants/organization.constants';
import { ICompanyAdminOrganizationPayload } from '../interfaces';
@Injectable()
export class OrganizationEventService {
    constructor(private readonly organizationService: OrganizationUnitService, private readonly organizationStaffingService: OrganizationStaffingService, private readonly userService: UserService) {}

    async createOrganizationUnit(payload: { companyId: string }, req: Request): Promise<void> {
        const logger = new Logger(OrganizationEventService.name + ' - createOrganizationUnit');

        const DEFAULT_ORGANIZATION_UNIT = {
            featureListId: [PERSONAL_DETAIL_STAFFING_ID, ORGANIZATION_DETAIL_STAFFING_ID, PROJECT_STAFFING_ID, PROJECT_PURPOSE_STAFFING_ID, MODEL_VERSION_STAFFING_ID, MODEL_REVIEWS_STAFFING_ID, MODEL_MONITORING_STAFFING_ID],
            unitName: UNIT_NAME,
            unitDescription: UNIT_DESCRIPTION,
            subscriptionType: ROLE.STAFF,
            companyID: payload.companyId,
            status: true,
            isMigrated: true
        };

        const organizationUnitDto = new CreateOrganizationUnitDto(DEFAULT_ORGANIZATION_UNIT);
        try {
            const organizationUnit = await this.organizationService.createNewOrganizationUnit(organizationUnitDto);
            const STATIC_STAFFING_UNIT = [
                {
                    staffingName: AI_ENGINEER,
                    featureAndAccess: [
                        {
                            accessType: ['R'],
                            featureId: PERSONAL_DETAIL_STAFFING_ID
                        },
                        {
                            accessType: ['R'],
                            featureId: ORGANIZATION_DETAIL_STAFFING_ID
                        },
                        {
                            accessType: ['R'],
                            featureId: PROJECT_STAFFING_ID
                        },
                        {
                            accessType: ['R', 'W', 'U'],
                            featureId: MODEL_VERSION_STAFFING_ID
                        },
                        {
                            accessType: ['R'],
                            featureId: MODEL_REVIEWS_STAFFING_ID
                        },
                        {
                            accessType: ['R'],
                            featureId: MODEL_MONITORING_STAFFING_ID
                        }
                    ]
                },
                {
                    staffingName: MLOps_ENGINEER,
                    featureAndAccess: [
                        {
                            accessType: ['R'],
                            featureId: PERSONAL_DETAIL_STAFFING_ID
                        },
                        {
                            accessType: ['R'],
                            featureId: ORGANIZATION_DETAIL_STAFFING_ID
                        },
                        {
                            accessType: ['R'],
                            featureId: PROJECT_STAFFING_ID
                        },
                        {
                            accessType: ['R'],
                            featureId: MODEL_VERSION_STAFFING_ID
                        },
                        {
                            accessType: ['R', 'W'],
                            featureId: MODEL_REVIEWS_STAFFING_ID
                        },
                        {
                            accessType: ['R', 'W'],
                            featureId: MODEL_MONITORING_STAFFING_ID
                        }
                    ]
                },
                {
                    staffingName: STAKEHOLDER,
                    featureAndAccess: [
                        {
                            accessType: ['R'],
                            featureId: PERSONAL_DETAIL_STAFFING_ID
                        },
                        {
                            accessType: ['R'],
                            featureId: ORGANIZATION_DETAIL_STAFFING_ID
                        },
                        {
                            accessType: ['R'],
                            featureId: PROJECT_STAFFING_ID
                        },
                        {
                            accessType: ['W'],
                            featureId: PROJECT_PURPOSE_STAFFING_ID
                        },
                        {
                            accessType: ['R'],
                            featureId: MODEL_VERSION_STAFFING_ID
                        },
                        {
                            accessType: ['R', 'W'],
                            featureId: MODEL_REVIEWS_STAFFING_ID
                        },
                        {
                            accessType: ['R', 'W'],
                            featureId: MODEL_MONITORING_STAFFING_ID
                        }
                    ]
                }
            ].map((staffingUnit) => ({
                ...staffingUnit,
                organizationUnitId: organizationUnit._id,
                status: true,
                bcNodeInfo: BC_NODE_INFO_ID,
                channels: [CHANNELS_DETAILS_ID],
                bucketUrl: ORACLE_BUCKET_URL,
                oracleGroupName: staffingUnit.staffingName.toLowerCase().replace(' ', '-')
            }));

            for (const staffingUnit of STATIC_STAFFING_UNIT) {
                const staffingUnitDto = new CreateStaffingDto(staffingUnit);
                try {
                    await this.organizationStaffingService.createNewStaffing(staffingUnitDto, req);
                } catch (error) {
                    logger.error(`Fail to create staffing units`, error);
                }
            }
        } catch (error) {
            logger.error(`Fail to create Organization Unit - ${payload.companyId}:`, error);
        }
    }

    async createCompanyAdminOrganization(payload: ICompanyAdminOrganizationPayload): Promise<void> {
        const logger = new Logger(OrganizationEventService.name + ' - Create company organization unit');

        const DEFAULT_ORGANIZATION_UNIT = {
            featureListId: [
                MANAGE_ALL_USER_STAFFING_ID,
                APPLICATION_LOGS_STAFFING_ID,
                PERSONAL_DETAIL_STAFFING_ID,
                ORGANIZATION_DETAIL_STAFFING_ID,
                ORGANIZATION_UNIT_STAFFING_ID,
                ORGANIZATION_USER_STAFFING_ID,
                USER_ACTIVITY_STAFFING_ID,
                MANAGE_BLOCKED_COMPANY_USERS_STAFFING_ID,
                CHANGE_USER_PASSWORD_STAFFING_ID,
                MANAGE_ALL_USER_STAFFING_ID,
                APPLICATION_LOGS_STAFFING_ID,
                PROJECT_STAFFING_ID,
                PROJECT_PURPOSE_STAFFING_ID,
                MODEL_VERSION_STAFFING_ID,
                MODEL_REVIEWS_STAFFING_ID,
                MODEL_MONITORING_STAFFING_ID
            ],
            unitName: payload.organizationName,
            unitDescription: payload.organizationName + ' ' + 'Organization',
            subscriptionType: payload.staffingType,
            companyID: payload.companyId,
            status: true,
            isMigrated: true
        };
        const organizationUnitDto = new CreateOrganizationUnitDto(DEFAULT_ORGANIZATION_UNIT);

        try {
            const organizationUnit = await this.organizationService.createNewOrganizationUnit(organizationUnitDto);

            const COMPANY_ADMIN_STAFFING_UNIT = {
                staffingName: payload.organizationName + '-' + 'Admin',
                featureAndAccess: [
                    {
                        accessType: ['R', 'W', 'U', 'D'],
                        featureId: MANAGE_ALL_USER_STAFFING_ID
                    },
                    {
                        accessType: ['R'],
                        featureId: APPLICATION_LOGS_STAFFING_ID
                    },
                    {
                        accessType: ['R', 'U'],
                        featureId: PERSONAL_DETAIL_STAFFING_ID
                    },
                    {
                        accessType: ['R'],
                        featureId: ORGANIZATION_DETAIL_STAFFING_ID
                    },
                    {
                        accessType: ['R', 'W', 'U', 'D'],
                        featureId: ORGANIZATION_UNIT_STAFFING_ID
                    },
                    {
                        accessType: ['R', 'W', 'U', 'D'],
                        featureId: ORGANIZATION_STAFFING_STAFFING_ID
                    },
                    {
                        accessType: ['R', 'W', 'U', 'D'],
                        featureId: ORGANIZATION_USER_STAFFING_ID
                    },
                    {
                        accessType: ['R'],
                        featureId: USER_ACTIVITY_STAFFING_ID
                    },
                    {
                        accessType: ['R', 'U'],
                        featureId: MANAGE_BLOCKED_COMPANY_USERS_STAFFING_ID
                    },
                    {
                        accessType: ['W'],
                        featureId: CHANGE_USER_PASSWORD_STAFFING_ID
                    },

                    {
                        accessType: ['R', 'W', 'U', 'D'],
                        featureId: PROJECT_STAFFING_ID
                    },
                    {
                        accessType: ['W'],
                        featureId: PROJECT_PURPOSE_STAFFING_ID
                    },
                    {
                        accessType: ['R', 'W', 'U'],
                        featureId: MODEL_VERSION_STAFFING_ID
                    },
                    {
                        accessType: ['R', 'W'],
                        featureId: MODEL_REVIEWS_STAFFING_ID
                    },
                    {
                        accessType: ['R', 'W'],
                        featureId: MODEL_MONITORING_STAFFING_ID
                    }
                ],
                organizationUnitId: organizationUnit._id,
                status: true,
                bcNodeInfo: payload.bcNodeInfo,
                channels: payload.channels,
                bucketUrl: null,
                oracleGroupName: (payload.organizationName + '-' + 'Admin').split(' ').join('-').toLowerCase()
            };

            const staffingUnitDto = new CreateStaffingDto(COMPANY_ADMIN_STAFFING_UNIT);
            try {
                const staffingUnit = await this.organizationStaffingService.createNewStaffing(staffingUnitDto, payload.req);
                try {
                    await this.userService.addStaffingId(payload.userId, payload.companyId, staffingUnit._id);
                } catch (error) {
                    logger.error(`Fail to add company admin staffing Id on verifying`, error);
                }
            } catch (error) {
                logger.error(`Fail to create company admin staffing units on verifying`, error);
            }
        } catch (error) {
            logger.error(`Fail to create company admin Organization Unit on verifying - ${payload.companyId}:`, error);
        }
    }
}

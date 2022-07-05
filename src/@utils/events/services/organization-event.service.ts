import { Injectable, Logger } from '@nestjs/common';
import { ROLE } from 'src/@core/constants';
import { CreateStaffingDto } from 'src/components/app-user/user-roles/organization-staffing/dto';
import { OrganizationStaffingService } from 'src/components/app-user/user-roles/organization-staffing/organization-staffing.service';
import { CreateOrganizationUnitDto } from 'src/components/app-user/user-roles/organization-unit/dto';
import { OrganizationUnitService } from 'src/components/app-user/user-roles/organization-unit/organization-unit.service';
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
    ORACLE_BUCKET_URL
} from '../constants/organization.constants';

@Injectable()
export class OrganizationEventService {
    constructor(private readonly organizationService: OrganizationUnitService, private readonly organizationStaffingService: OrganizationStaffingService) {}

    async createOrganizationUnit(payload: { companyId: string }): Promise<void> {
        const logger = new Logger(OrganizationEventService.name + ' - createOrganizationUnit');

        const DEFAULT_ORGANIZATION_UNIT = {
            featureListId: [PERSONAL_DETAIL_STAFFING_ID, ORGANIZATION_DETAIL_STAFFING_ID, PROJECT_STAFFING_ID, PROJECT_PURPOSE_STAFFING_ID, MODEL_VERSION_STAFFING_ID, MODEL_REVIEWS_STAFFING_ID, MODEL_MONITORING_STAFFING_ID],
            unitName: UNIT_NAME,
            unitDescription: UNIT_DESCRIPTION,
            subscriptionType: ROLE.STAFF,
            companyID: payload.companyId,
            status: true
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
                            accessType: ['R', 'W'],
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
                bucketUrl: ORACLE_BUCKET_URL
            }));

            for (const staffingUnit of STATIC_STAFFING_UNIT) {
                const staffingUnitDto = new CreateStaffingDto(staffingUnit);
                try {
                    await this.organizationStaffingService.createNewStaffing(staffingUnitDto);
                } catch (error) {
                    logger.error(`Fail to create staffing units`, error);
                }
            }
        } catch (error) {
            logger.error(`Fail to create Organization Unit - ${payload.companyId}:`, error);
        }
    }
}

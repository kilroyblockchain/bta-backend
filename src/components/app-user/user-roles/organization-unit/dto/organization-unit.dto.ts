import { ApiProperty } from '@nestjs/swagger';
import { TimestampDto } from 'src/@core/response/dto';
import { OrganizationStaffResponse } from '../../organization-staffing/dto';

export class OrganizationUnitResponse extends TimestampDto {
    @ApiProperty({
        example: 'Unit Id',
        description: 'ID'
    })
    _id: string;

    @ApiProperty({
        example: 'Id',
        description: 'Company Id'
    })
    companyID: string;

    @ApiProperty({
        example: 'Director',
        description: 'Unit Name'
    })
    unitName: string;

    @ApiProperty({
        example: 'Company directors department',
        description: 'Unit Description'
    })
    unitDescription?: string;

    @ApiProperty({
        example: 'staff',
        description: 'Subscription Type'
    })
    subscriptionType: string;

    @ApiProperty({
        example: ['Feature Id'],
        description: 'List of feature id'
    })
    featureListId?: string[];

    @ApiProperty({
        example: true,
        description: 'Document Status'
    })
    status: boolean;

    @ApiProperty({
        example: true,
        description: 'Document Migration Status'
    })
    isMigrated: boolean;

    @ApiProperty({
        example: [
            {
                _id: 'Id',
                organizationUnitId: 'Unit Id',
                staffingName: 'ABC Staff',
                featureAndAccess: [
                    {
                        featureId: 'Feature Id',
                        accessType: ['R', 'W', 'U', 'D']
                    }
                ],
                status: true
            }
        ],
        description: 'List of Staff in this unit'
    })
    staffing_records?: OrganizationStaffResponse[];
}

export class DeletedOrganizationUnitResponse extends OrganizationUnitResponse {
    @ApiProperty({
        example: false,
        description: 'Document Status'
    })
    status: boolean;
}

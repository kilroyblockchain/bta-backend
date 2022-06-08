import { ApiProperty } from '@nestjs/swagger';
import { TimestampDto } from 'src/@core/response/dto';
import { IFeature } from 'src/components/flo-user/features/interfaces/features.interface';

export class OrganizationStaffResponse extends TimestampDto {
    @ApiProperty({
        example: 'Id',
        description: 'Id of document'
    })
    _id: string;

    @ApiProperty({
        example: 'Unit Id',
        description: 'Organization unit id'
    })
    organizationUnitId: string;

    @ApiProperty({
        example: 'ABC Staff',
        description: 'Staffing Name'
    })
    staffingName: string;

    @ApiProperty({
        example: [
            {
                featureId: 'Feature Id',
                accessType: ['R', 'W', 'U', 'D']
            }
        ],
        description: 'Feature and access detail'
    })
    featureAndAccess?: [
        {
            featureId?: string | IFeature;
            accessType?: string[];
        }
    ];

    @ApiProperty({
        example: true,
        description: 'Status'
    })
    status?: boolean;
}

export class DeletedOrganizationStaffResponse extends OrganizationStaffResponse {
    @ApiProperty({
        example: false,
        description: 'Status'
    })
    status?: boolean;
}

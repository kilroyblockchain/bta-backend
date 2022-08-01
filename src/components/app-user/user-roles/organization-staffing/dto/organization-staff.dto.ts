import { ApiProperty } from '@nestjs/swagger';
import { IFeature } from 'app-migrations/feature-migrate/interfaces/feature.interface';
import { TimestampDto } from 'src/@core/response/dto';

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
    featureAndAccess?: {
        featureId?: string | IFeature;
        accessType?: string[];
    }[];

    @ApiProperty({
        example: true,
        description: 'Status'
    })
    status?: boolean;

    @ApiProperty({
        description: 'Id of bcNodeInfo for staffing',
        example: '62bf110abae854986e95799b'
    })
    bcNodeInfo: string;

    @ApiProperty({
        description: 'Id of bc channel for staffing',
        example: ['62bea0296e7a4bfd3ff56268']
    })
    channels: string[];

    @ApiProperty({
        description: 'Url of oracle bucket for staffing',
        example: 'https://orcalebucket.org'
    })
    bucketUrl: string;

    @ApiProperty({
        description: 'Oracle group name',
        example: 'ai-engineer-1'
    })
    oracleGroupName: string;
}

export class DeletedOrganizationStaffResponse extends OrganizationStaffResponse {
    @ApiProperty({
        example: false,
        description: 'Status'
    })
    status?: boolean;
}

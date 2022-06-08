import { ApiProperty } from '@nestjs/swagger';

export class OrganizationUnitResponse {
    @ApiProperty({
        example: 'Id',
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
        example: ['id1', 'id2'],
        description: 'List of feature id'
    })
    featureListId?: string[];

    @ApiProperty({
        example: true,
        description: 'Document Status'
    })
    status: boolean;
}

export class DeletedOrganizationUnitResponse extends OrganizationUnitResponse {
    @ApiProperty({
        example: false,
        description: 'Document Status'
    })
    status: boolean;
}

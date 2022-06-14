import { BaseEmailDto } from './email.dto';

export class OrganizationRejectedBodyContextDto {
    email: string;
    organization: string;
    description: string;
}

export class OrganizationRejectedEmailDto extends BaseEmailDto<OrganizationRejectedBodyContextDto> {}

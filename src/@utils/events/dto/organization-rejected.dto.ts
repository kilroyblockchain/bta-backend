import { BaseEmailDto } from './email.dto';

export class OrganizationRejectedBodyContextDto {
    email: string;
    organization: string;
    description: string;

    constructor({ email, organization, description }) {
        this.email = email;
        this.organization = organization;
        this.description = description;
    }
}

export class OrganizationRejectedEmailDto extends BaseEmailDto<OrganizationRejectedBodyContextDto> {
    constructor({ to, title, subject, partialContext }) {
        super({ to, title, subject });
        this.partialContext = partialContext;
    }
}

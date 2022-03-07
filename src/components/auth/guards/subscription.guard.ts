import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { OrganizationService } from 'src/components/flo-user/organization/organization.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
    constructor(private readonly organizationService: OrganizationService) {}
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const organization = await this.organizationService.findOrganizationById(user.company.find((defaultCompany) => defaultCompany.default && defaultCompany.verified && !defaultCompany.isDeleted).companyId);
        const allowSubscription = organization.subscription.filter((enableSubscription) => enableSubscription.status).map((subs) => subs.type);
        const roles = [];
        user.company.forEach((company) => {
            if (company.verified && !company.isDeleted && company.companyId.toString() === organization._id.toString()) {
                roles.push(company.subscriptionType);
            }
        });
        if (!allowSubscription.some((element) => roles.includes(element)) && organization.subscription && organization.subscription.length) {
            throw new ForbiddenException('Access Denied');
        }
        return true;
    }
}

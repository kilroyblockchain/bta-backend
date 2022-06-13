import { Module } from '@nestjs/common';
import { FeatureModule } from './features/features.module';
import { CountryModule } from './country/country.module';
import { OrganizationModule } from './organization/organization.module';
import { SubscriptionTypeModule } from './subscription-type/subscription-type.module';
import { UserRejectInfoModule } from './user-reject-info/user-reject-info.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { UserModule } from './user/user.module';
import { VerificationModule } from './verification/verification.module';

@Module({
    imports: [UserModule, OrganizationModule, CountryModule, SubscriptionTypeModule, FeatureModule, UserRolesModule, VerificationModule, UserRejectInfoModule]
})
export class AppUserModule {}

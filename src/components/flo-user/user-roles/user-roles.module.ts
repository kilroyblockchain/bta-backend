import { OrganizationStaffingModule } from './organization-staffing/organization-staffing.module';
import { Module } from '@nestjs/common';
import { OrganizationUnitModule } from './organization-unit/organization-unit.module';

@Module({
    imports: [OrganizationUnitModule, OrganizationStaffingModule]
})
export class UserRolesModule {}

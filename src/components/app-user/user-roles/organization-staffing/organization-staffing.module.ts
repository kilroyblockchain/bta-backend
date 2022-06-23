import { StaffingSchema } from './schemas/organization-staffing.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationStaffingController } from './organization-staffing.controller';
import { OrganizationStaffingService } from './organization-staffing.service';
import { forwardRef, Module } from '@nestjs/common';
import { OrganizationUnitModule } from '../organization-unit/organization-unit.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Staffing', schema: StaffingSchema }]), forwardRef(() => OrganizationUnitModule)],
    controllers: [OrganizationStaffingController],
    providers: [OrganizationStaffingService],
    exports: [OrganizationStaffingService]
})
export class OrganizationStaffingModule {}

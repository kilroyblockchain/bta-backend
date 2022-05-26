import { OrganizationUnitSchema } from './schemas/organization-unit.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationUnitService } from './organization-unit.service';
import { OrganizationUnitController } from './organization-unit.controller';
import { forwardRef, Module } from '@nestjs/common';
import { OrganizationStaffingModule } from '../organization-staffing/organization-staffing.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'OrganizationUnit', schema: OrganizationUnitSchema }]), forwardRef(() => OrganizationStaffingModule)],
    controllers: [OrganizationUnitController],
    providers: [OrganizationUnitService],
    exports: [OrganizationUnitService]
})
export class OrganizationUnitModule {}

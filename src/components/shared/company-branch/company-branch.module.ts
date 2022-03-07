import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/components/auth/auth.module';
import { CaModule } from 'src/components/certificate-authority/ca-client.module';
import { CompanyBranchController } from 'src/components/shared/company-branch/company-branch.controller';
import { CompanyBranchService } from 'src/components/shared/company-branch/company-branch.service';
import { CompanyBranchBcService } from './company-branch-bc.service';
import { companyBranchSchema } from './schema/company-branch.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'CompanyBranch', schema: companyBranchSchema }]), AuthModule, CaModule],
    controllers: [CompanyBranchController],
    providers: [CompanyBranchService, CompanyBranchBcService],
    exports: [CompanyBranchService]
})
export class CompanyBranchModule {}

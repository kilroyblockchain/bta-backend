import { Module } from '@nestjs/common';
import { CompanyBranchModule } from './company-branch/company-branch.module';

@Module({
    imports: [CompanyBranchModule]
})
export class SharedModule {}

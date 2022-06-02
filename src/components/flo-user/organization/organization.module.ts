import { MongooseModule } from '@nestjs/mongoose';
import { Global, Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationSchema } from './schemas/organization.schema';
import { OrganizationController } from './organization.controller';
import { OrganizationBcService } from './organization-bc.service';
import { CaModule } from 'src/components/certificate-authority/ca-client.module';
@Global()
@Module({
    imports: [MongooseModule.forFeature([{ name: 'Organization', schema: OrganizationSchema }]), CaModule],
    controllers: [OrganizationController],
    providers: [OrganizationService, OrganizationBcService],
    exports: [OrganizationService]
})
export class OrganizationModule {}

import { MongooseModule } from '@nestjs/mongoose';
import { Global, Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationSchema } from './schemas/organization.schema';
import { OrganizationController } from './organization.controller';
@Global()
@Module({
    imports: [MongooseModule.forFeature([{ name: 'Organization', schema: OrganizationSchema }])],
    controllers: [OrganizationController],
    providers: [OrganizationService],
    exports: [OrganizationService]
})
export class OrganizationModule {}

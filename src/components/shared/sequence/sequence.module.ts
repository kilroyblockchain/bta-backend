/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { SequenceSchema } from './schemas/sequence.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SequenceService } from './sequence.service';
import { OrganizationModule } from 'src/components/flo-user/organization/organization.module';
import { AuthModule } from 'src/components/auth/auth.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'sequence', schema: SequenceSchema }]), OrganizationModule, AuthModule],
    providers: [SequenceService],
    exports: [SequenceService]
})
export class SequenceModule {}

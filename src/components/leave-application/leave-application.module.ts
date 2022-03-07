import { AuthModule } from 'src/components/auth/auth.module';
import { LeaveApplicationService } from './leave-application.service';
import { LeaveApplicationController } from './leave-application.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaveApplicationSchema } from './schemas/leave-application.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'LeaveApplication', schema: LeaveApplicationSchema }]), AuthModule],
    controllers: [LeaveApplicationController],
    providers: [LeaveApplicationService]
})
export class LeaveApplicationModule {}

import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { VerificationSchema } from './schemas/verification.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Verification', schema: VerificationSchema }])],
    controllers: [VerificationController],
    providers: [VerificationService],
    exports: [VerificationService]
})
export class VerificationModule {}

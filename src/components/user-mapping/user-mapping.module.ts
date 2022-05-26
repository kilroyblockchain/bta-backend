import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../flo-user/user/schemas/user.schema';
import { ParticipantSchema } from '../participant/schemas/participant.schema';
import { UserMappingSchema } from './schemas/user-mapping.schema';
import { UserMappingController } from './user-mapping.controller';
import { UserMappingService } from './user-mapping.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'UserMapping', schema: UserMappingSchema },
            { name: 'User', schema: UserSchema },
            { name: 'Participant', schema: ParticipantSchema }
        ])
    ],
    controllers: [UserMappingController],
    providers: [UserMappingService]
})
export class UserMappingModule {}

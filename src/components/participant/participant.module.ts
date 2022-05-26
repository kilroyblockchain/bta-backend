import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelDetailSchema } from '../blockchain/channel-detail/schema/channel-detail.schema';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { ParticipantSchema } from './schemas/participant.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'ChannelDetail', schema: ChannelDetailSchema }]), MongooseModule.forFeature([{ name: 'Participant', schema: ParticipantSchema }])],
    controllers: [ParticipantController],
    providers: [ParticipantService]
})
export class ParticipantModule {}

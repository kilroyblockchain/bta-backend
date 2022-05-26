import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_CONSTANT } from 'src/@core/constants/api-error-constants';
import { PARTICIPANT_CONSTANT } from 'src/@core/constants/api-error-constants/participant.constant';
import { USER_MAPPING_CONSTANT } from 'src/@core/constants/api-error-constants/user-mapping.constant';
import { IUser } from '../flo-user/user/interfaces/user.interface';
import { IParticipant } from '../participant/interfaces/participant.interface';
import { sha256Hash } from '../utils/helpers';
import { UserMappingAddDto } from './dto/user-mapping-add.dto';
import { IUserMapping } from './interfaces/user-mapping.interface';

@Injectable()
export class UserMappingService {
    constructor(@InjectModel('UserMapping') private readonly UserMappingModel: Model<IUserMapping>, @InjectModel('User') private readonly UserModel: Model<IUser>, @InjectModel('Participant') private readonly ParticipantModel: Model<IParticipant>) {}

    async createUserMapping(userMappingDto: UserMappingAddDto): Promise<void> {
        const logger = new Logger('CreateUserMapping');

        const userMappingDataDb = await this.UserMappingModel.findOne({ participantId: userMappingDto.participantId, userId: userMappingDto.userId });
        if (userMappingDataDb) {
            logger.error(USER_MAPPING_CONSTANT.USER_MAPPING_ALREADY_EXIST + ': ParticipantId - ' + userMappingDto.participantId + ',  UserId - ' + userMappingDto.userId);
            throw new BadRequestException([USER_MAPPING_CONSTANT.USER_MAPPING_ALREADY_EXIST + ': ParticipantId - ' + userMappingDto.participantId + ',  UserId - ' + userMappingDto.userId]);
        }

        // Check User
        const user = await this.UserModel.findById(userMappingDto.userId);
        if (!user) {
            logger.error(USER_CONSTANT.USER_NOT_FOUND);
            throw new BadRequestException([USER_CONSTANT.USER_NOT_FOUND]);
        }

        // Check Participant
        const participant = await this.ParticipantModel.findById(userMappingDto.participantId);
        if (!participant) {
            logger.error(PARTICIPANT_CONSTANT.PARTICIPANT_NOT_FOUND);
            throw new BadRequestException([PARTICIPANT_CONSTANT.PARTICIPANT_NOT_FOUND]);
        }

        const sha256HashRes = await sha256Hash(user.id + participant.id);
        const userMapping = new this.UserMappingModel(userMappingDto);

        userMapping.participant = userMappingDto.participantId;
        userMapping.user = userMappingDto.userId;
        userMapping.walletId = sha256HashRes;
        await userMapping.save();
    }
}

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { PARTICIPANT_CONSTANT } from 'src/@core/constants/api-error-constants/participant.constant';
import { CHANNEL_DETAIL } from 'src/@core/constants/bc-constants/channel-detail.constant';
import { getSearchFilterWithRegexAll } from 'src/@core/utils/query-filter.utils';
import { IChannelDetail } from '../blockchain/channel-detail/interfaces/channel-detail.interface';
import { ParticipantAddDto } from './dto/participant-add.dto';
import { IParticipant } from './interfaces/participant.interface';

@Injectable()
export class ParticipantService {
    constructor(@InjectModel('Participant') private readonly participantModel: PaginateModel<IParticipant>, @InjectModel('Participant') private readonly ParticipantModel: Model<IParticipant>, @InjectModel('ChannelDetail') private readonly ChannelDetailModel: Model<IChannelDetail>) {}

    async createParticipant(participantAddDto: ParticipantAddDto): Promise<void> {
        const logger = new Logger('CreateParticipant');
        const participantDataDb = await this.ParticipantModel.findOne({ type: participantAddDto.type });
        if (participantDataDb) {
            logger.error(PARTICIPANT_CONSTANT.PARTICIPANT_ALREADY_EXIST + ': ' + participantAddDto.type);
            throw new BadRequestException([PARTICIPANT_CONSTANT.PARTICIPANT_ALREADY_EXIST, participantAddDto.type]);
        }
        const channelNotFoundIds = [];
        for (const channelId of participantAddDto.channelDetailIds) {
            const channelDetail = await this.ChannelDetailModel.findById(channelId).select('_id');
            if (!channelDetail) {
                channelNotFoundIds.push(channelId);
                logger.error(CHANNEL_DETAIL.CHANNEL_DETAIL_NOT_FOUND + ': ' + channelId);
                throw new BadRequestException([CHANNEL_DETAIL.CHANNEL_DETAIL_NOT_FOUND, channelId]);
            }
        }
        const participant = new this.ParticipantModel(participantAddDto);
        participant.channelDetail = participantAddDto.channelDetailIds;
        await participant.save();
    }

    async getAllParticipant(req: Request): Promise<PaginateResult<IParticipant>> {
        const { page, limit, search, searchValue } = req.query;
        const query = { status: true };
        const searchQuery = search && search === 'true' && searchValue ? getSearchFilterWithRegexAll(searchValue.toString(), ['type', 'instanceName']) : {};
        const options = {
            populate: { path: 'channelDetail', select: 'channelName -_id', model: this.ChannelDetailModel },
            sort: { updatedAt: -1 },
            page: Number(page),
            limit: Number(limit)
        };
        return await this.participantModel.paginate({ ...query, ...searchQuery }, options);
    }
}

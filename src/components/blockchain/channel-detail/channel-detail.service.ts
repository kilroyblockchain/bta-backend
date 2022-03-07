import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { ChannelDetailDto } from './dto/channel-detail.dto';
import { IChannelDetail } from './interfaces/channel-detail.interface';
import { Request } from 'express';
import { CHANNEL_DETAIL } from 'src/@core/constants/bc-constants/channel-detail.constant';

@Injectable()
export class ChannelDetailService {
    constructor(
        @InjectModel('channelDetail')
        private readonly ChannelDetailModel: PaginateModel<IChannelDetail>
    ) {}

    /**
     * Add Channel Detail on MongoDB
     * Includes Channel Name and Connection Profile Name
     *
     * @param {ChannelDetailDto} channelDetailDto - Object of Channel Detail Dto
     * @returns {Promise<IChannelDetail>} - Returns Promise of IChannel Detail
     *
     **/
    async addChannelDetail(channelDetailDto: ChannelDetailDto): Promise<IChannelDetail> {
        const logger = new Logger('AddChannelDetail');
        const channelDetail = await this.ChannelDetailModel.findOne({
            channelName: channelDetailDto.channelName
        });
        if (channelDetail) {
            logger.error(CHANNEL_DETAIL.CHANNEL_DETAIL_ALREADY_EXISTS, ' : ', channelDetailDto.channelName);
            throw new ConflictException(CHANNEL_DETAIL.CHANNEL_DETAIL_ALREADY_EXISTS);
        }
        const defaultChannelDetail = await this.ChannelDetailModel.findOne({
            isDefault: true
        });
        if (defaultChannelDetail && channelDetailDto.isDefault) {
            logger.error(CHANNEL_DETAIL.DEFAULT_CHANNEL_DETAIL_ALREADY_EXISTS, ' : ', channelDetailDto.channelName);
            throw new ConflictException(CHANNEL_DETAIL.DEFAULT_CHANNEL_DETAIL_ALREADY_EXISTS);
        }
        const channelDetailSaved = new this.ChannelDetailModel(channelDetailDto);
        return await channelDetailSaved.save();
    }

    /**
     * Updates Channel Detail on MongoDB by channel Id
     * Includes Channel Name and Connection Profile Name
     *
     * @param {string} channelDetailId - String of Channel Detail Id (Channel Id)
     * @param {ChannelDetailDto} channelDetailDto - Object of Channel Detail Dto
     * @returns {Promise<IChannelDetail>} - Returns Promise of IChannel Detail
     *
     **/
    async updateChannelDetail(channelDetailId: string, channelDetailDto: ChannelDetailDto): Promise<IChannelDetail> {
        const channelDetail = await this.ChannelDetailModel.findOne({
            channelName: channelDetailDto.channelName
        });
        if (channelDetail && channelDetail._id != channelDetailId) {
            throw new ConflictException(CHANNEL_DETAIL.CHANNEL_DETAIL_ALREADY_EXISTS);
        }
        await this.ChannelDetailModel.updateOne({ _id: channelDetailId }, channelDetailDto);
        return await this.getChannelDetailById(channelDetailId);
    }

    /**
     * Get All Channel Details including both disabled and enabled channel
     *
     * @param {Request} req - API Request that includes page no and limit used for pagination
     *
     **/
    async getAllChannelDetail(req: Request) {
        const query = {};
        const option = {
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 10,
            sort: { updatedAt: -1 }
        };
        return await this.ChannelDetailModel.paginate(query, option);
    }

    /**
     * Get Channel Detail by Id
     *
     * @param {string} channelId - Id of the channel Detail saved
     *
     **/
    async getChannelDetailById(channelId: string) {
        const channelDetail = await this.ChannelDetailModel.findById(channelId);
        if (!channelDetail) {
            throw new NotFoundException(CHANNEL_DETAIL.CHANNEL_DETAIL_NOT_FOUND);
        }
        return channelDetail;
    }

    /**
     * Get All Channel Detail By Status 'true' | 'false'
     *
     * @param {Request} req - API Request that includes page no and limit used for pagination
     * @param {bolean} status - Channel Detail status 'true' | 'false'
     *
     **/
    async getAllChannelDetailByStatus(req: Request, status: boolean) {
        const query = { status: status };
        const option = {
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 10,
            sort: { updatedAt: -1 }
        };
        return await this.ChannelDetailModel.paginate(query, option);
    }

    /**
     * Delete Channel Detail
     *
     * @param {string} channelId - Id of the channel Detail to be deleted
     *
     **/
    async deleteChannelDetail(channelId: string) {
        const channelDetail = await this.ChannelDetailModel.findById(channelId);
        if (!channelDetail) {
            throw new NotFoundException(CHANNEL_DETAIL.CHANNEL_DETAIL_NOT_FOUND);
        }
        await this.ChannelDetailModel.deleteOne({ _id: channelId });
    }

    /**
     * Function to Get Default Channel Detail
     *
     **/
    async getDefaultChannelDetail() {
        const logger = new Logger('GetDefaultChannel');
        const channelDetail = await this.ChannelDetailModel.findOne({
            isDefault: true
        });
        if (!channelDetail) {
            logger.error(CHANNEL_DETAIL.DEFAULT_CHANNEL_DETAIL_NOT_FOUND);
            throw new NotFoundException(CHANNEL_DETAIL.DEFAULT_CHANNEL_DETAIL_NOT_FOUND);
        }
        return channelDetail;
    }

    /**
     * Function to Get All Non Channel Detail List
     *
     **/
    async getAllNonDefaultChannelDetails() {
        return await this.ChannelDetailModel.find({ isDefault: false });
    }
}

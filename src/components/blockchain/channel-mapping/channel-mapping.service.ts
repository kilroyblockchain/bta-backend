import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { IChannelMapping } from './interfaces/channel-mapping.interface';
import { ChannelMappingDto } from './dto/channel-mapping.dto';
import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CHANNEL_MAPPING } from 'src/@core/constants/bc-constants/channel-mapping.constant';
import { ChannelDetailService } from '../channel-detail/channel-detail.service';
import { CHANNEL_DETAIL } from 'src/@core/constants/bc-constants/channel-detail.constant';
import { ChannelMappingResponseDto } from './dto/channel-mapping-response.dto';

@Injectable()
export class ChannelMappingService {
    constructor(
        @InjectModel('channelMapping')
        private readonly ChannelMappingModel: PaginateModel<IChannelMapping>,
        private readonly channelDetailService: ChannelDetailService
    ) {}

    /**
     * Add Channel Mapping on MongoDB
     * Includes Channel Id, Organization Id and wallet Id of the partiuluar User
     *
     * @param {ChannelMappingDto} channelMappingDto - Object of Channel Mapping Dto
     * @returns {Promise<IChannelMapping>} - Returns Promise of IChannel Mapping
     *
     *
     **/
    async addChannelMapping(channelMappingDto: ChannelMappingDto): Promise<IChannelMapping> {
        const logger = new Logger('AddChannelMapping');
        const channelDetail = await this.channelDetailService.getChannelDetailById(channelMappingDto.channelId);
        if (!channelDetail) {
            logger.error(CHANNEL_DETAIL.CHANNEL_DETAIL_NOT_FOUND);
            throw new NotFoundException(CHANNEL_DETAIL.CHANNEL_DETAIL_NOT_FOUND);
        }
        const channelMapping = await this.ChannelMappingModel.findOne({
            userId: channelMappingDto.userId,
            organizationId: channelMappingDto.organizationId,
            channelId: channelMappingDto.channelId,
            staffingId: channelMappingDto.staffingId
        });
        if (channelMapping) {
            logger.error(CHANNEL_MAPPING.CHANNEL_MAPPING_ALREADY_EXISTS);
            logger.error('User Id: ' + channelMappingDto.userId);
            logger.error('Organization Id: ' + channelMappingDto.organizationId);
            logger.error('Staffing Id: ' + channelMappingDto.staffingId);
            logger.error('Channel Id: ' + channelMappingDto.channelId);
            throw new ConflictException(CHANNEL_MAPPING.CHANNEL_MAPPING_ALREADY_EXISTS);
        }
        const channelMappingSaved = new this.ChannelMappingModel(channelMappingDto);
        return await channelMappingSaved.save();
    }

    /**
     * Get Channel Mapping By user id and organization Id
     *
     *
     * @param {string} userId - Id of loggedin user
     * @param {string} organizationId - Id of default organization
     * @returns {Promise<IChannelMapping>} - Returns Promise of IChannel Mapping
     *
     *
     **/
    async getChannelMappingByUserAndOrganization(userId: string, organizationId: string): Promise<ChannelMappingResponseDto> {
        const logger = new Logger('GetChannelMappingByUserAndOrganization');
        const channelMapping: IChannelMapping = await this.ChannelMappingModel.findOne({
            userId: userId,
            organizationId: organizationId
        });
        if (!channelMapping) {
            logger.error(CHANNEL_MAPPING.CHANNEL_MAPPING_NOT_FOUND);
            logger.error('User Id: ' + userId);
            logger.error('Organization Id: ' + organizationId);
            throw new NotFoundException(CHANNEL_MAPPING.CHANNEL_MAPPING_NOT_FOUND);
        }
        const channelDetail = await this.channelDetailService.getChannelDetailById(channelMapping.channelId);
        const channelMappingResponseDto = new ChannelMappingResponseDto();
        channelMappingResponseDto.channelMapping = channelMapping;
        channelMappingResponseDto.channelDetail = channelDetail;
        return channelMappingResponseDto;
    }

    /**
     * Get Channel Mapping By user id, organization Id and staffing id
     *
     *
     * @param {string} userId - Id of logged in user
     * @param {string} organizationId - Id of default organization
     * @param {string} staffingId - Id of staffing
     * @returns {Promise<IChannelMapping>} - Returns Promise of IChannel Mapping
     *
     *
     **/
    async getChannelMappingByUserOrganizationAndStaffing(userId: string, organizationId: string, staffingId: string): Promise<ChannelMappingResponseDto> {
        const logger = new Logger('GetChannelMappingByUserOrganizationAndStaffing');
        const channelMapping: IChannelMapping = await this.ChannelMappingModel.findOne({
            userId: userId,
            organizationId: organizationId,
            staffingId: staffingId
        });
        if (!channelMapping) {
            logger.error(CHANNEL_MAPPING.CHANNEL_MAPPING_NOT_FOUND);
            logger.error('User Id: ' + userId);
            logger.error('Organization Id: ' + organizationId);
            logger.error('Staffing Id: ' + staffingId);
            throw new NotFoundException(CHANNEL_MAPPING.CHANNEL_MAPPING_NOT_FOUND);
        }
        const channelDetail = await this.channelDetailService.getChannelDetailById(channelMapping.channelId);
        const channelMappingResponseDto = new ChannelMappingResponseDto();
        channelMappingResponseDto.channelMapping = channelMapping;
        channelMappingResponseDto.channelDetail = channelDetail;
        return channelMappingResponseDto;
    }

    /**
     * Check Channel Mapping Exists By user id, organization Id and staffing id
     *
     *
     * @param {string} userId - Id of logged in user
     * @param {string} organizationId - Id of default organization
     * @param {string} staffingId - Id of staffing
     * @returns {Promise<boolean>} - Returns Promise of boolean
     *
     *
     **/
    async checkChannelMappingByUserOrganizationAndStaffing(userId: string, organizationId: string, staffingId: string): Promise<boolean> {
        const channelMapping: IChannelMapping = await this.ChannelMappingModel.findOne({
            userId: userId,
            organizationId: organizationId,
            staffingId: staffingId
        });
        if (!channelMapping) {
            return false;
        }
        return true;
    }
}

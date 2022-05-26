import { IChannelDetail } from '../../channel-detail/interfaces/channel-detail.interface';
import { IChannelMapping } from '../interfaces/channel-mapping.interface';

export class ChannelMappingResponseDto {
    channelMapping: IChannelMapping;
    channelDetail: IChannelDetail;
}

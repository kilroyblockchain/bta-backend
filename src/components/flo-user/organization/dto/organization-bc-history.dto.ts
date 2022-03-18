import { BcHistoryResponseDto } from 'src/components/blockchain/dto/bc-history-response.dto';
import { IOrganization } from '../interfaces/organization.interface';

export class OrganizationBcHistoryDto {
    blockchainHistory: BcHistoryResponseDto[];
    organizationData: IOrganization;
}

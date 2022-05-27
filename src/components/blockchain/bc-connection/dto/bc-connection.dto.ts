import { BcHistoryResponseDto } from '../../dto/bc-history-response.dto';
import { BcQueryResponseDto } from '../../dto/bc-query-response.dto';

export class BcConnectionDto {
    data: BcQueryResponseDto | BcHistoryResponseDto[];

    constructor(data: BcQueryResponseDto | BcHistoryResponseDto[]) {
        this.data = data;
    }
}

import { Injectable, ExecutionContext, CanActivate, Logger, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { BC_ERROR_RESPONSE } from 'src/@core/constants/bc-constants/bc-error-response.constants';
import { decryptKey } from 'src/@utils/helpers';
import { BcConnectionService } from 'src/components/blockchain/bc-connection/bc-connection.service';
import { BcNodeInfoService } from 'src/components/blockchain/bc-node-info/bc-node-info.service';
import { BcUserAuthenticationDto } from 'src/components/blockchain/dto/bc-user-authentication.dto';
dotenv.config();

@Injectable()
export class BlockchainGuard implements CanActivate {
    constructor(private readonly bcNodeInfo: BcNodeInfoService, private readonly bcConnectionService: BcConnectionService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const logger = new Logger('BlockchainGuard');
        const request = context.switchToHttp().getRequest();

        // Checking if bc-key exists on header
        if (!request.headers['bc-key']) {
            logger.error('Key not found on header: ' + request.headers['bc-key']);
            throw new UnauthorizedException(['Bc key not found on header']);
        }
        const user = request['user'];
        const bcNodeInfo = await this.bcNodeInfo.getBcNodeInfoById(user.company[0].staffingId[0].bcNodeInfo.toString());
        try {
            // Check valid bc-key on blockchain
            await this.bcConnectionService.checkBcNodeConnection(bcNodeInfo, new BcUserAuthenticationDto(await decryptKey(request.headers['bc-key']), user.bcSalt));
        } catch (err) {
            logger.error(err);
            throw new UnauthorizedException([BC_ERROR_RESPONSE.INVALID_BC_KEY]);
        }
        return request;
    }
}

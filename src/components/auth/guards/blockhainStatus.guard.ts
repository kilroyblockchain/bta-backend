import { Injectable, ExecutionContext, CanActivate, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { BC_STATUS } from 'src/@core/constants/bc-status.enum';
import { BcConnectionService } from 'src/components/blockchain/bc-connection/bc-connection.service';
dotenv.config();

@Injectable()
export class BlockchainStatusGuard extends AuthGuard('jwt') implements CanActivate {
    public userinfo;
    constructor(private readonly bcConnectionService: BcConnectionService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const logger = new Logger('BlockchainGuard');
        const request = context.switchToHttp().getRequest();
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const response = await this.bcConnectionService.checkUser(request.user._id);
            if (!response) {
                logger.error('User not registered on the network: ' + request.user._id);
                throw new UnauthorizedException('User not registered on the network');
            }
        }

        return request;
    }
}

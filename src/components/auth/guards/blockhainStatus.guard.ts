import { Injectable, ExecutionContext, CanActivate, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as dotenv from 'dotenv';
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
        // TODO: Checking valid BC Key
        if (!request.headers.key) {
            logger.error('Key not found on header: ' + request.headers.key);
            throw new UnauthorizedException();
        }
        return request;
    }
}

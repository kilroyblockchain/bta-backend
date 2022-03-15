import { Injectable, ExecutionContext, CanActivate, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { BC_STATUS } from 'src/@core/constants/bc-status.enum';
import { CaService } from 'src/components/certificate-authority/ca-client.service';
dotenv.config();

@Injectable()
export class BlockchainStatusGuard extends AuthGuard('jwt') implements CanActivate {
    public userinfo;
    constructor(private readonly reflector: Reflector, private readonly caService: CaService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const logger = new Logger('BlockchainGuard');
        const request = context.switchToHttp().getRequest();
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const company = request['user'].company.find((defaultCompany) => defaultCompany.default);
            const response = await this.caService.getUserCert(request.user._id, company);
            if (!response) {
                logger.error('User not registered on the network: ' + request.user._id);
                throw new UnauthorizedException('User not registered on the network');
            }
        }

        return request;
    }
}

import { Injectable, ExecutionContext, ForbiddenException, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    handleRequest(err, user, info: Error, context: ExecutionContext) {
        const logger = new Logger(RolesGuard.name + '-handleRequest');
        try {
            const roles = this.reflector.get<string[]>('roles', context.getHandler());
            let hasRole: boolean;
            if (!user) {
                throw new UnauthorizedException();
            }
            if (!roles) {
                return user;
            }
            const isVerified = user.company.some((verifiedCompany) => {
                hasRole = roles.includes(verifiedCompany.subscriptionType);
                return verifiedCompany.verified && !verifiedCompany.isDeleted && hasRole;
            });
            if (!isVerified) {
                throw new ForbiddenException();
            }
            if (!hasRole) {
                throw new ForbiddenException('Forbidden');
            }
            return user;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}

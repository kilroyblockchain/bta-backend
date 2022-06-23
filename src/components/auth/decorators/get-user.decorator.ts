import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { IUser } from 'src/components/app-user/user/interfaces/user.interface';

interface IGetUserAuthInfo extends Express.Request {
    user: IUser;
}

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
    const logger = new Logger('GetUserDecorator');
    try {
        const request: IGetUserAuthInfo = ctx.switchToHttp().getRequest();
        if (data) {
            if (data === 'default-company') {
                return request.user.company.find((defaultCompany) => defaultCompany.default);
            }
            return request.user[data];
        }
        return request.user;
    } catch (err) {
        logger.error(err);
        throw err;
    }
});

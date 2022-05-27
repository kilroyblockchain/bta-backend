import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from 'src/components/flo-user/user/interfaces/user.interface';

interface IGetUserAuthInfo extends Express.Request {
    user: IUser;
}

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
    const request: IGetUserAuthInfo = ctx.switchToHttp().getRequest();
    if (data) {
        if (data === 'default-company') {
            return request.user.company.find((defaultCompany) => defaultCompany.default);
        }
        return request.user[data];
    }
    return request.user;
});

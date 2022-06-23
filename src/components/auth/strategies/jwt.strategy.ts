import { JwtPayload } from './../interfaces/jwt-payload.interface';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { IUser } from 'src/components/app-user/user/interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: authService.returnJwtExtractor(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        });
    }

    async validate(jwtPayload: JwtPayload): Promise<IUser> {
        const logger = new Logger(JwtStrategy.name + '-validate');
        try {
            const user = await this.authService.validateUser(jwtPayload);
            if (!user) {
                throw new UnauthorizedException();
            }
            return user;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}

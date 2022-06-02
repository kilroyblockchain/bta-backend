import { IBasicUserInfo, ICompany } from '../flo-user/user/interfaces/user.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sign, verify } from 'jsonwebtoken';
import { IUser } from 'src/components/flo-user/user/interfaces/user.interface';
import { IRefreshToken } from './interfaces/refresh-token.interface';
import { v4 } from 'uuid';
import { Request, Response } from 'express';
import { getClientIp } from 'request-ip';
import * as Cryptr from 'cryptr';
import { COOKIE_KEYS } from 'src/@core/constants/cookie-key.constant';
import { USER_CONSTANT } from 'src/@core/constants/api-error-constants';
import { HttpService } from '@nestjs/axios';
import { StaffingInterface } from '../flo-user/user-roles/organization-staffing/interfaces/organization-staffing.interface';
import { IFeature } from '../flo-user/features/interfaces/features.interface';

@Injectable()
export class AuthService {
    REFRESH_TOKEN_EXPIRATION_MS = parseInt(process.env.REFRESH_TOKEN_EXPIRATION_MIN) * 60 * 1000;
    cryptr: Cryptr;

    constructor(
        @InjectModel('User') private readonly userModel: Model<IUser>,
        @InjectModel('RefreshToken')
        private readonly refreshTokenModel: Model<IRefreshToken>,
        private httpService: HttpService
    ) {
        this.cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
    }

    async createAccessToken(userId: string): Promise<string> {
        const logger = new Logger(AuthService.name + '-createAccessToken');
        try {
            const accessToken = sign({ userId }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION
            });
            return this.encryptText(accessToken);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async createResetToken(userId: string): Promise<string> {
        const logger = new Logger(AuthService.name + '-createResetToken');
        try {
            const resetToken = sign({ userId }, process.env.RESET_PASSWORD_SECRET, {
                expiresIn: '20m'
            });
            return resetToken;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async verifyToken(token: string, secret: string): Promise<JwtPayload> {
        const logger = new Logger(AuthService.name + '-verifyToken');
        try {
            let decoded: JwtPayload;
            await verify(token, secret, function (err, decodedData: JwtPayload) {
                if (err) {
                    throw new BadRequestException('Invalid token or it is expired');
                }
                decoded = decodedData;
            });
            return decoded;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async createRefreshToken(req: Request, userId: string, companyId?: string): Promise<string> {
        const logger = new Logger(AuthService.name + '-createRefreshToken');
        try {
            let query = {};
            if (companyId) {
                query = { company: companyId };
            }
            const refreshTokenData = await this.refreshTokenModel.findOne({
                $and: [{ userId, ...query }, { expireIn: { $gte: new Date() } }, { $or: [{ revoke: { $eq: null } }, { revoke: { $exists: false } }] }]
            });
            if (refreshTokenData) {
                refreshTokenData.expireIn = new Date(Date.now() + this.REFRESH_TOKEN_EXPIRATION_MS);
                await refreshTokenData.save();
                return refreshTokenData.refreshToken;
            } else {
                const refreshToken = new this.refreshTokenModel({
                    userId,
                    company: companyId ? companyId : this.getDefaultCompany(req).companyId,
                    refreshToken: v4(),
                    ip: this.getIp(req),
                    browser: this.getBrowserInfo(req),
                    country: this.getCountry(req),
                    expireIn: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRATION_MS)
                });
                await refreshToken.save();
                return refreshToken.refreshToken;
            }
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async updateRefreshToken(req: Request): Promise<IRefreshToken> {
        const logger = new Logger(AuthService.name + '-updateRefreshToken');
        try {
            const refreshToken = req.cookies[COOKIE_KEYS.REFRESH_TOKEN];
            if (refreshToken) {
                const refreshTokenData = await this.refreshTokenModel.findOne({
                    revoke: null,
                    refreshToken: this.decryptText(refreshToken)
                });
                if (refreshTokenData) {
                    refreshTokenData.expireIn = new Date(Date.now() + this.REFRESH_TOKEN_EXPIRATION_MS);
                    return await refreshTokenData.save();
                }
                throw new UnauthorizedException(USER_CONSTANT.USER_HAS_BEEN_LOGGED_OUT);
            } else {
                throw new UnauthorizedException(USER_CONSTANT.USER_HAS_BEEN_LOGGED_OUT);
            }
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async findRefreshToken(token: string): Promise<string> {
        const logger = new Logger(AuthService.name + '-findRefreshToken');
        try {
            const refreshToken = await this.refreshTokenModel.findOne({
                refreshToken: token
            });
            if (!refreshToken) {
                throw new UnauthorizedException('User has been logged out.');
            }
            return <string>refreshToken.userId;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async validateUser(jwtPayload: JwtPayload): Promise<IUser> {
        const logger = new Logger(AuthService.name + '-validateUser');
        try {
            const user = await this.userModel
                .findOne({
                    _id: jwtPayload.userId,
                    $and: [
                        { 'company.verified': true },
                        {
                            $or: [{ 'company.isDeleted': false }, { 'company.isDeleted': null }]
                        },
                        { 'company.default': true }
                    ]
                })
                .populate({
                    path: 'company.staffingId',
                    populate: { path: 'featureAndAccess.featureId', model: 'feature' }
                });
            if (!user) {
                throw new UnauthorizedException('User not found.');
            }
            return user;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    validateUserRecaptcha(req: Request, token): Promise<boolean> {
        const logger = new Logger(AuthService.name + '-validateUserRecaptcha');
        try {
            return new Promise((resolve) => {
                const secretKey = process.env.RE_CAPTCHA_SECRET;
                const clientIp = this.getIp(req);
                if (!token) resolve(false);
                const verificationURL = 'https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey + '&response=' + token + '&remoteip=' + clientIp;
                this.httpService.get(verificationURL).subscribe((res) => {
                    resolve(res.data.success);
                });
            });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    private jwtExtractor(request): string {
        const logger = new Logger(AuthService.name + '-jwtExtractor');
        try {
            let token = null;
            if (request.header('x-token')) {
                token = request.get('x-token');
            } else if (request.headers.authorization) {
                token = request.headers.authorization.replace('Bearer ', '').replace(' ', '');
            } else if (request.body.token) {
                token = request.body.token.replace(' ', '');
            }
            if (request.query.token) {
                token = request.body.token.replace(' ', '');
            }
            const cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
            if (token) {
                try {
                    token = cryptr.decrypt(token);
                } catch (err) {
                    throw new BadRequestException('Bad request.');
                }
            }
            return token;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    returnJwtExtractor(): (req: Request) => string {
        const logger = new Logger(AuthService.name + '-returnJwtExtractor');
        try {
            return this.jwtExtractor;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    getIp(req: Request): string {
        const logger = new Logger(AuthService.name + '-getIp');
        try {
            return getClientIp(req);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    getBrowserInfo(req: Request): string {
        const logger = new Logger(AuthService.name + '-getBrowserInfo');
        try {
            return req.headers['user-agent'] || 'XX';
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    getCountry(req: Request): string {
        const logger = new Logger(AuthService.name + '-getCountry');
        try {
            return req.headers['cf-ipcountry'] ? (req.headers['cf-ipcountry'] as string) : 'XX';
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    encryptText(text: string): string {
        const logger = new Logger(AuthService.name + '-encryptText');
        try {
            return this.cryptr.encrypt(text);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    getDefaultCompany(req: Request): ICompany {
        const logger = new Logger(AuthService.name + '-getDefaultCompany');
        try {
            if (req['user']) {
                return req['user'].company.find((defaultCompany) => defaultCompany.default);
            }
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    getLoggedInUserInformationFromRequest(req: Request): IBasicUserInfo {
        const logger = new Logger(AuthService.name + '-getLoggedInUserInformationFromRequest');
        try {
            if (req['user']) {
                return {
                    id: req['user']._id,
                    defaultCompany: this.getDefaultCompany(req),
                    companies: req['user'].company,
                    firstName: req['user'].firstName,
                    lastName: req['user'].lastName,
                    fullName: `${req['user'].firstName} ${req['user'].lastName}`
                };
            }
            return null;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    getCompanyAcronym(companyName: string): string {
        const logger = new Logger(AuthService.name + '-getCompanyAcronym');
        try {
            return companyName
                .replace(/[^a-zA-Z ]/g, '')
                .split(/\s/)
                .reduce((response, word) => (response += word.slice(0, 1)), '')
                .toUpperCase();
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    decryptText(encryptedString: string): string {
        const logger = new Logger(AuthService.name + '-decryptText');
        try {
            const cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
            try {
                const decryptedString = cryptr.decrypt(encryptedString);
                return decryptedString;
            } catch (err) {
                throw new UnauthorizedException('Login to continue');
            }
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    setCookie(cookieName: string, token: string, res: Response): void {
        const logger = new Logger(AuthService.name + '-setCookie');
        try {
            const cookieOptions = {
                httpOnly: true,
                expires: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRATION_MS),
                secure: true
            };
            res.cookie(cookieName, this.encryptText(token), cookieOptions);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    destroyCookie(cookieName: string, res: Response): void {
        const logger = new Logger(AuthService.name + '-destroyCookie');
        try {
            res.cookie(cookieName, { expires: new Date() });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    verifyExpiredToken(encryptedToken: string, secret: string): boolean | string {
        const logger = new Logger(AuthService.name + '-verifyExpiredToken');
        try {
            if (encryptedToken) {
                const token = this.decryptText(encryptedToken);
                return <string>verify(token, secret, { ignoreExpiration: true });
            } else {
                return false;
            }
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async revokeRefreshToken(req: Request): Promise<void> {
        const logger = new Logger(AuthService.name + '-revokeRefreshToken');
        try {
            const refreshToken = req.cookies[COOKIE_KEYS.REFRESH_TOKEN];
            if (refreshToken) {
                const refreshTokenData = await this.refreshTokenModel.findOne({
                    refreshToken: this.decryptText(refreshToken)
                });
                if (refreshTokenData) {
                    refreshTokenData.revoke = new Date();
                    refreshTokenData.revokeIp = this.getIp(req);
                    await refreshTokenData.save();
                }
            } else {
                throw new UnauthorizedException('Logout user');
            }
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async userNameFromRefreshToken(refreshToken: string): Promise<string> {
        const logger = new Logger(AuthService.name + '-userNameFromRefreshToken');
        try {
            const refreshTokenData = await this.refreshTokenModel.findOne({
                refreshToken: this.decryptText(refreshToken)
            });
            if (refreshTokenData && refreshTokenData.userId) {
                const userId = refreshTokenData.userId;
                const user = await this.userModel.findById(userId);
                return user.firstName + ' ' + user.lastName;
            } else {
                throw new UnauthorizedException(USER_CONSTANT.USER_HAS_BEEN_LOGGED_OUT);
            }
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    canAccess(loggedInUser: IUser, featureIdentifier: string, featureAccessType: string[]): boolean {
        const logger = new Logger(AuthService.name + '-canAccess');
        try {
            const defaultCompany = loggedInUser.company.find((company) => company.default);
            let returnValue = defaultCompany?.isAdmin;
            if (!returnValue && defaultCompany?.staffingId) {
                (defaultCompany?.staffingId as StaffingInterface[]).map((staffing) => {
                    staffing.featureAndAccess.map((feature) => {
                        if (feature.featureId && (feature.featureId as IFeature).featureIdentifier === featureIdentifier) {
                            feature.accessType.map((access) => {
                                if (featureAccessType.includes(access)) {
                                    returnValue = true;
                                }
                            });
                        }
                    });
                });
            }
            return returnValue ?? false;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}

import { IBasicUserInfo, ICompany } from '../flo-user/user/interfaces/user.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sign, verify } from 'jsonwebtoken';
import { IUser } from 'src/components/flo-user/user/interfaces/user.interface';
import { IRefreshToken } from './interfaces/refresh-token.interface';
import { v4 } from 'uuid';
import { Request, Response } from 'express';
import { getClientIp } from 'request-ip';
import * as Cryptr from 'cryptr';
import { imageHash } from 'image-hash';
import { COOKIE_KEYS } from 'src/@core/constants/cookie-key.constant';
import { USER_CONSTANT } from 'src/@core/constants/api-error-constants';
import { HttpService } from '@nestjs/axios';

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
        const accessToken = sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION
        });
        return this.encryptText(accessToken);
    }

    async createResetToken(userId: string): Promise<string> {
        const resetToken = sign({ userId }, process.env.RESET_PASSWORD_SECRET, {
            expiresIn: '20m'
        });
        return resetToken;
    }

    async verifyToken(token: string, secret: string): Promise<JwtPayload> {
        let decoded: JwtPayload;
        await verify(token, secret, function (err, decodedData: JwtPayload) {
            if (err) {
                throw new BadRequestException('Invalid token or it is expired');
            }
            decoded = decodedData;
        });
        return decoded;
    }

    async createRefreshToken(req: Request, userId: string, companyId?: string): Promise<string> {
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
    }

    async updateRefreshToken(req: Request): Promise<IRefreshToken> {
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
    }

    async findRefreshToken(token: string): Promise<string> {
        const refreshToken = await this.refreshTokenModel.findOne({
            refreshToken: token
        });
        if (!refreshToken) {
            throw new UnauthorizedException('User has been logged out.');
        }
        return <string>refreshToken.userId;
    }

    async validateUser(jwtPayload: JwtPayload): Promise<IUser> {
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
    }

    validateUserRecaptcha(req: Request, token): Promise<boolean> {
        return new Promise((resolve) => {
            const secretKey = process.env.RE_CAPTCHA_SECRET;
            const clientIp = this.getIp(req);
            if (!token) resolve(false);
            const verificationURL = 'https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey + '&response=' + token + '&remoteip=' + clientIp;
            this.httpService.get(verificationURL).subscribe((res) => {
                resolve(res.data.success);
            });
        });
    }

    private jwtExtractor(request): string {
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
    }

    returnJwtExtractor(): (req: Request) => string {
        return this.jwtExtractor;
    }

    getIp(req: Request): string {
        return getClientIp(req);
    }

    getBrowserInfo(req: Request): string {
        return req.headers['user-agent'] || 'XX';
    }

    getCountry(req: Request): string {
        return req.headers['cf-ipcountry'] ? (req.headers['cf-ipcountry'] as string) : 'XX';
    }

    encryptText(text: string): string {
        return this.cryptr.encrypt(text);
    }

    getDefaultCompany(req: Request): ICompany {
        if (req['user']) {
            return req['user'].company.find((defaultCompany) => defaultCompany.default);
        }
    }

    getLoggedInUserInformationFromRequest(req: Request): IBasicUserInfo {
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
    }

    getImageHash(location, cb): void {
        imageHash('./././uploads/' + location, 16, true, (error, data) => {
            if (error) throw error;
            return cb(error, data);
        });
    }

    getCompanyAcronym(companyName: string): string {
        return companyName
            .replace(/[^a-zA-Z ]/g, '')
            .split(/\s/)
            .reduce((response, word) => (response += word.slice(0, 1)), '')
            .toUpperCase();
    }

    decryptText(encryptedString: string): string {
        const cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
        try {
            const decryptedString = cryptr.decrypt(encryptedString);
            return decryptedString;
        } catch (err) {
            throw new UnauthorizedException('Login to continue');
        }
    }

    setCookie(cookieName: string, token: string, res: Response): void {
        const cookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRATION_MS),
            secure: true
        };
        res.cookie(cookieName, this.encryptText(token), cookieOptions);
    }

    destroyCookie(cookieName: string, res: Response): void {
        res.cookie(cookieName, { expires: new Date() });
    }

    verifyExpiredToken(encryptedToken: string, secret: string): boolean | string {
        if (encryptedToken) {
            const token = this.decryptText(encryptedToken);
            return <string>verify(token, secret, { ignoreExpiration: true });
        } else {
            return false;
        }
    }

    async revokeRefreshToken(req: Request): Promise<void> {
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
    }

    async userNameFromRefreshToken(refreshToken: string): Promise<string> {
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
    }
}

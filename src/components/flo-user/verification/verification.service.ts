import { v4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { IVerification } from './interfaces/verification.interface';
import { VERIFICATION_CONSTANT } from 'src/@core/constants/api-error-constants';

@Injectable()
export class VerificationService {
    constructor(
        @InjectModel('Verification')
        private readonly VerificationModel: Model<IVerification>
    ) {}

    async createAcceptToken(user: any, companyName: string, subscriptionType: string, roles) {
        const token = v4();
        const verificationDto = {
            email: user.email,
            userName: user.firstName + ' ' + user.lastName,
            userAcceptToken: token,
            userAccept: false,
            requestedBy: companyName,
            subscriptionType: subscriptionType,
            roles: roles.join(),
            timeStamp: new Date()
        };
        const userAcceptToken = await this.VerificationModel.findOne({
            email: user.email,
            userAcceptToken: token
        });
        if (userAcceptToken) {
            userAcceptToken.userAcceptToken = token;
            userAcceptToken.userAccept = false;
            userAcceptToken.requestedBy = companyName;
            userAcceptToken.roles = roles.join();
            return await userAcceptToken.save();
        } else {
            const newUserAccept = new this.VerificationModel(verificationDto);
            return await newUserAccept.save();
        }
    }

    async setUserAccept(token: string) {
        const userAcceptToken = await this.VerificationModel.findOne({
            userAcceptToken: token,
            userAccept: false
        });
        if (userAcceptToken && userAcceptToken.userAccept) {
            throw new BadRequestException(VERIFICATION_CONSTANT.USER_ALREADY_ACCEPTED_THIS_REQUEST);
        } else {
            await this.VerificationModel.update(
                {
                    userAcceptToken: token
                },
                {
                    userAccept: true
                }
            );
            return userAcceptToken;
        }
    }

    async getDetailsByToken(token: string): Promise<IVerification> {
        const userDetails = await this.VerificationModel.findOne({
            userAcceptToken: token
        });
        if (!userDetails) {
            throw new NotFoundException(VERIFICATION_CONSTANT.INVALID_TOKEN);
        }
        if (userDetails && userDetails.userAccept) {
            throw new BadRequestException(VERIFICATION_CONSTANT.USER_ALREADY_ACCEPTED_THIS_REQUEST);
        }
        return userDetails;
    }
}

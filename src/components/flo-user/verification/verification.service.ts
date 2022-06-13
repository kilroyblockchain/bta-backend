import { IUser } from 'src/components/flo-user/user/interfaces/user.interface';
import { v4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { IVerification } from './interfaces/verification.interface';
import { VERIFICATION_CONSTANT } from 'src/@core/constants/api-error-constants';
import { VerificationResponse } from './dto';

@Injectable()
export class VerificationService {
    constructor(
        @InjectModel('Verification')
        private readonly VerificationModel: Model<IVerification>
    ) {}

    async createAcceptToken(user: IUser, companyName: string, subscriptionType: string, roles): Promise<IVerification> {
        const logger = new Logger(VerificationService.name + '-createAcceptToken');
        try {
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
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async setUserAccept(token: string): Promise<IVerification> {
        const logger = new Logger(VerificationService.name + '-setUserAccept');
        try {
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
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getDetailsByToken(token: string): Promise<VerificationResponse> {
        const logger = new Logger(VerificationService.name + '-getDetailsByToken');
        try {
            const userDetails = await this.VerificationModel.findOne({
                userAcceptToken: token
            });
            if (!userDetails) {
                throw new NotFoundException(VERIFICATION_CONSTANT.INVALID_TOKEN);
            }
            if (userDetails && userDetails.userAccept) {
                throw new BadRequestException(VERIFICATION_CONSTANT.USER_ALREADY_ACCEPTED_THIS_REQUEST);
            }
            return this.buildVerificationResponse(userDetails);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    buildVerificationResponse(verificationDetail: IVerification): VerificationResponse {
        const logger = new Logger(VerificationService.name + '-buildVerificationResponse');
        if (verificationDetail) {
            const verificationResponse = new VerificationResponse();
            verificationResponse._id = verificationDetail._id;
            verificationResponse.email = verificationDetail.email;
            verificationResponse.userName = verificationDetail.userName;
            verificationResponse.userAcceptToken = verificationDetail.userAcceptToken;
            verificationResponse.userAccept = verificationDetail.userAccept;
            verificationResponse.timeStamp = verificationDetail.timeStamp;
            verificationResponse.requestedBy = verificationDetail.requestedBy;
            verificationResponse.subscriptionType = verificationDetail.subscriptionType;
            verificationResponse.roles = verificationDetail.roles;
            return verificationResponse;
        } else {
            logger.log('Verification detail not found');
            throw new BadRequestException('Verification detail not found');
        }
    }
}

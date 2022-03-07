import { Injectable, BadRequestException, NotFoundException, ConflictException, Inject, forwardRef, ForbiddenException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { Request, Response } from 'express';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { addHours } from 'date-fns';
import config from 'src/@core/config/keys';
import { EMAIL_CONSTANTS, ROLE } from 'src/@core/constants';
import { COMMON_ERROR, USER_CONSTANT, VERIFICATION_CONSTANT } from 'src/@core/constants/api-error-constants';
import { SubscriptionTypeDto } from './dto/add-subscription.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyUuidDto } from './dto/verify-uuid.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { NewUserDto } from './dto/new-user.dto';
import { CreateUserByTransferDto } from './dto/create-user-transferid.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { CreateUserSequenceDto } from './dto/new-user-sequence.dto';
import { AddCompanyDto } from './dto/add-company.dto';
import { AddBirthDateDto } from './dto/add-birthdate.dto';
import { SetDefaultCompanyDto } from './dto/set-default-company.dto';
import { AddSkillDto } from './dto/add-skill.dto';
import { AddLanguageDto } from './dto/add-language.dto';
import { OrganizationService } from '../organization/organization.service';
import { AuthService } from 'src/components/auth/auth.service';
import { MailService } from 'src/components/utils/mail/mail.service';
import { CompanyTransferService } from '../company-transfer/company-transfer.service';
import { SubscriptionTypeService } from '../subscription-type/subscription-type.service';
import { VerificationService } from '../verification/verification.service';
import { OrganizationStaffingService } from '../user-roles/organization-staffing/organization-staffing.service';
import { ICompany, IUser, ILoginCount } from './interfaces/user.interface';
import { Err } from 'src/@core/interfaces/error.interface';
import { IUserData } from './interfaces/response.interface';
import { IReportIssue } from '../report-issue/interfaces/report-issue.interface';
import { Organization } from '../organization/interfaces/organization.interface';
import { IUserSequence } from './interfaces/user-sequence.interface';
import * as util from 'util';
import { UserBcService } from './user-bc.service';
import { AddEducationDto } from './dto/add-education.dto';
import { AddExperienceDto } from './dto/add-experience.dto';
import { RemoveExperienceDto } from './dto/remove-experience.dto';
import { RemoveEducationDto } from './dto/remove-education.dto';
import { BC_STATUS } from 'src/@core/constants/bc-status.enum';
import { getArraysComplement, getClientTimezoneId, getHourMinuteDiff } from 'src/@core/utils/common.utils';
import { BC_PAYLOAD } from 'src/@core/constants/bc-constants/bc-payload.constant';
import { fullSubscriptionType } from '../subscription-type/subscription-type.constant';
import { ExperienceBcService } from '../user-extra-info/experience/experience-bc.service';
import { EducationBcService } from '../user-extra-info/education/education-bc.service';
import { getSearchFilterWithRegexAll } from 'src/@core/utils/query-filter.utils';
import { getFinalPaginationResult, populateField } from 'src/@core/utils/aggregate-paginate.utils';
import { BcUserDto } from 'src/@core/common/bc-user.dto';
import { CaService } from 'src/components/certificate-authority/ca-client.service';
import { CHANNEL_DETAIL } from 'src/@core/constants/bc-constants/channel-detail.constant';
import { RejectUserDto } from './dto/reject-user.dto';
import { UserRejectInfoService } from '../user-reject-info/user-reject-info.service';
import { CAPTCHA_STATUS } from 'src/@core/constants/captcha-status.enum';
import { COOKIE_KEYS } from 'src/@core/constants/cookie-key.constant';
import { IUserActivityResponse, RefreshToken } from 'src/components/auth/interfaces/refresh-token.interface';

@Injectable()
export class UserService {
    HOURS_TO_VERIFY = 4;
    HOURS_TO_BLOCK = 6;
    LOGIN_ATTEMPTS_TO_BLOCK = parseInt(process.env.LOGIN_ATTEMPTS_TO_BLOCK) || 5;

    getImageHashPromise: any;

    constructor(
        @InjectModel('User') private readonly uModel: PaginateModel<IUser>,
        @InjectModel('User') private readonly UserModel: Model<IUser>,
        @InjectModel('userSequence')
        private readonly UserSequenceModel: Model<IUserSequence>,
        @Inject(forwardRef(() => CompanyTransferService))
        private readonly companyTransferService: CompanyTransferService,
        @InjectModel('RefreshToken')
        private readonly RefreshTokenModel: PaginateModel<RefreshToken>,
        private readonly organizationService: OrganizationService,
        private readonly authService: AuthService,
        private readonly mailService: MailService,
        private readonly subsTypeService: SubscriptionTypeService,
        private readonly userBcService: UserBcService,
        private readonly verificationService: VerificationService,
        private readonly staffingService: OrganizationStaffingService,
        private readonly experienceBcService: ExperienceBcService,
        private readonly educationBcService: EducationBcService,
        private readonly caService: CaService,
        private readonly userRejectInfoService: UserRejectInfoService
    ) {
        this.getImageHashPromise = util.promisify(this.authService.getImageHash);
    }
    async register(req: Request, logoName: string, registerUserDto: RegisterUserDto): Promise<IUser | Err> {
        const user = new this.UserModel(registerUserDto);
        if (process.env.RE_CAPTCHA_STATUS !== CAPTCHA_STATUS.DISABLED) {
            const captchaValidation: any = await this.validateUserRecaptcha(req, registerUserDto.reCaptchaToken);
            if (!captchaValidation) throw new BadRequestException(USER_CONSTANT.PLEASE_VERIFY_THAT_YOU_ARE_A_HUMAN);
        }
        const isEmailUnique = await this.isEmailUnique(user.email);
        if (!isEmailUnique) throw new BadRequestException([USER_CONSTANT.USER_EMAIL_HAS_ALREADY_BEEN_REGISTERED, user.email]);
        const isOrganizationNameUnique = await this.organizationService.isOrganizationNameUnique(registerUserDto.companyName);
        let organizationData;
        const randomPassword = Math.random().toString(36).slice(-8);
        if (registerUserDto.subscriptionType === 'vaccination-appointment' && !isOrganizationNameUnique) {
            organizationData = await this.organizationService.getOrganizationByName(registerUserDto.companyName);
        } else {
            if (!isOrganizationNameUnique) throw new BadRequestException([COMMON_ERROR.COMPANYNAME_HAS_ALREADY_BEEN_REGISTERED, registerUserDto.companyName]);
            const orgData = await this.organizationService.buildEmptyOrganizaton(registerUserDto);
            const organization = await this.organizationService.createOrganization(req, logoName, orgData);
            organizationData = await organization.save();
            // if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            //     const orgAdmin = process.env.CA_ADMIN_ID;
            //     await this.organizationBcService.storeOrganizationBC(organizationData, orgAdmin, BC_PAYLOAD.CREATE_ORGANIZATION);
            // }
        }

        this.setRegistrationInfo(user);
        user.company = [this.initUserCompany(organizationData, registerUserDto, true, false, true)];
        user.password = randomPassword;
        const seqDetail = await this.getNextSequence(organizationData._id);
        user.userId = `${seqDetail.organizationCode}A${seqDetail.currentSeq}`;
        await user.save();
        await this.updateSequence(seqDetail);
        if (registerUserDto.subscriptionType === 'vaccination-appointment') {
            const subcriptionTypeFull = await this.subsTypeService.getFullSubscription(registerUserDto.subscriptionType);
            await this.mailService.sendMail(user.email, EMAIL_CONSTANTS.FLO, EMAIL_CONSTANTS.TITLE_WELCOME, config.MAIL_TYPES.SUBSCRIBER_EMAIL, {
                user: user,
                subscriptionType: subcriptionTypeFull,
                email: user.email,
                password: randomPassword,
                clientAppURL: process.env.CLIENT_APP_URL
            });
        }
        return this.buildRegistrationInfo(user);
    }

    initUserCompany(organizationData: Organization | any, registerUserDto: RegisterUserDto | any, isAdmin: boolean, verified: boolean, isDeleted = false): ICompany {
        return {
            companyId: organizationData._id,
            staffingId: registerUserDto.staffingId,
            subscriptionType: registerUserDto.subscriptionType,
            userAccept: true,
            default: true,
            verified,
            isDeleted,
            isAdmin: registerUserDto.subcriptionType === 'vaccination-appointment' ? false : isAdmin
        };
    }

    async createUserForOrganization(newUserDto: NewUserDto, req: Request, subscription: string) {
        const newUser = new this.UserModel(newUserDto);
        const parentUser = req['user'];
        const defaultCompany = parentUser.company.find((defaultComp) => defaultComp.default);
        const organizationData = {
            _id: defaultCompany.companyId
        };
        const userDto = {
            staffingId: newUserDto.staffingId,
            subscriptionType: subscription && subscription !== 'undefined' ? subscription : defaultCompany.subscriptionType
        };
        let randomPassword = null;
        try {
            randomPassword = Math.random().toString(36).slice(-8);
            newUser.password = randomPassword;
        } catch (err) {
            throw new Error(USER_CONSTANT.FAILED_TO_GENERATE_RANDOM_PASSWORD_PLEASE_TRY_AGAIN);
        }
        const isEmailUnique = await this.isEmailUnique(newUser.email);
        if (!isEmailUnique) throw new BadRequestException([USER_CONSTANT.USER_EMAIL_HAS_ALREADY_BEEN_REGISTERED, newUser.email]);
        newUser.company = [this.initUserCompany(organizationData, userDto, false, true)];
        const seqDetail = await this.getNextSequence(organizationData._id);
        newUser.userId = `${seqDetail.organizationCode}U${seqDetail.currentSeq}`;
        const user = await newUser.save();
        await this.updateSequence(seqDetail);
        const userDetail: any = await this.uModel
            .findById(user._id)
            .populate({
                path: 'company.companyId company.staffingId country state',
                select: '-countryCode -idNumber -phoneCode -states -countryId -countryObjectId -__v',
                populate: { path: 'featureAndAccess.featureId organizationUnitId' }
            })
            .select('-password');

        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            bcUserDto.enrollmentId = user._id;
            bcUserDto.enrollmentSecret = randomPassword;
            await this.userBcService.storeUserBc(user, bcUserDto, BC_PAYLOAD.CREATE_USER);
            await this.caService.userRegistrationListStaffing(newUserDto.staffingId, bcUserDto);
        }
        const subcriptionTypeFull = await this.subsTypeService.getFullSubscription(userDto.subscriptionType);
        await this.mailService.sendMail(user.email, EMAIL_CONSTANTS.FLO, EMAIL_CONSTANTS.TITLE_WELCOME, config.MAIL_TYPES.SUBSCRIBER_EMAIL, {
            user: user,
            subscriptionType: subcriptionTypeFull,
            email: user.email,
            password: randomPassword,
            clientAppURL: process.env.CLIENT_APP_URL
        });
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            const blockchainVerified = await this.userBcService.getBlockchainVerifiedUser(userDetail, bcUserDto);
            return { ...userDetail['_doc'], blockchainVerified };
        }
        return userDetail;
    }

    async updatePersonalDetails(updateUserDto: UpdateUserDto, req: Request): Promise<IUser> {
        const user = await this.findVerifiedUserByEmail(updateUserDto.email);
        if (user) {
            user.firstName = updateUserDto.firstName;
            user.lastName = updateUserDto.lastName;
            user.phone = updateUserDto.phone;
            user.country = updateUserDto.country;
            user.state = updateUserDto.state;
            user.city = updateUserDto.city;
            user.address = updateUserDto.address;
            user.jobTitle = updateUserDto.jobTitle;
            user.zipCode = updateUserDto.zipCode;
            const updatedUser: any = await user.save();
            if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                const bcUserDto = new BcUserDto();
                bcUserDto.loggedInUserId = req['user']._id;
                bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
                await this.userBcService.storeUserBc(updatedUser, bcUserDto, BC_PAYLOAD.UPDATE_USER);
                const blockchainVerified = await this.userBcService.getBlockchainVerifiedUser(updatedUser, bcUserDto);
                return { ...updatedUser._doc, blockchainVerified };
            }
            return await this.getUserDataByJWT(req);
        }
        throw new NotFoundException(USER_CONSTANT.USER_NOT_FOUND);
    }

    async addBirthDate(birthDateDto: AddBirthDateDto): Promise<IUser> {
        const user = await this.findVerifiedUserByEmail(birthDateDto.email);
        if (user) {
            user.birthDate = new Date(birthDateDto.birthDate);
            return await user.save();
        }
        throw new NotFoundException(USER_CONSTANT.USER_NOT_FOUND);
    }

    async addNewRole(req: Request): Promise<IUser> {
        const { newRole } = req.query;
        const defaultCompany: ICompany = req['user'].company.find((defaultComp) => defaultComp.default);
        defaultCompany.subscriptionType = ROLE[<string>newRole];
        const email = req['user'].email;
        const user = await this.findVerifiedUserByEmail(email);
        if (user) {
            user.company.push(defaultCompany);
            return await user.save();
        }
        throw new NotFoundException(USER_CONSTANT.USER_NOT_FOUND);
    }

    async updateUserByOrganizationAdmin(updateUserDto: NewUserDto, userId: string, req: Request) {
        const updatingUser = await this.uModel.findOne({ _id: userId });
        if (updatingUser) {
            const userWithEmail = await this.uModel.findOne({
                email: updateUserDto.email
            });
            if (!userWithEmail || userWithEmail?.id === userId) {
                updatingUser.firstName = updateUserDto.firstName;
                updatingUser.lastName = updateUserDto.lastName;
                updatingUser.company = updatingUser.company.map((comp) => {
                    if (comp.default) {
                        comp.staffingId = updateUserDto.staffingId;
                    }
                    return comp;
                });
                updatingUser.phone = updateUserDto.phone;
                updatingUser.email = updateUserDto.email;
                updatingUser.country = updateUserDto.country;
                updatingUser.state = updateUserDto.state;
                updatingUser.city = updateUserDto.city;
                updatingUser.address = updateUserDto.address;
                updatingUser.zipCode = updateUserDto.zipCode;
                if (updateUserDto.sponsorOrganizationName) {
                    updatingUser.sponsorOrganizationName = updateUserDto.sponsorOrganizationName;
                }
                await updatingUser.save();
                if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                    const updatedUser = await this.uModel.findOne({ _id: userId });
                    const bcUserDto = new BcUserDto();
                    bcUserDto.loggedInUserId = req['user']._id;
                    bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
                    await this.userBcService.storeUserBc(updatedUser, bcUserDto, BC_PAYLOAD.UPDATE_USER);
                }
                const userData: any = await this.uModel
                    .findById(userId)
                    .populate({
                        path: 'company.companyId company.staffingId skill language education experience country state',
                        select: '-countryCode -idNumber -phoneCode -states -countryId -countryObjectId -__v',
                        populate: { path: 'featureAndAccess.featureId organizationUnitId' }
                    })
                    .select('-password');
                if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                    const bcUserDto = new BcUserDto();
                    bcUserDto.loggedInUserId = req['user']._id;
                    bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
                    const blockchainVerified = await this.userBcService.getBlockchainVerifiedUser(userData, bcUserDto);
                    return { ...userData['_doc'], blockchainVerified };
                }
                return userData;
            } else {
                throw new ConflictException([USER_CONSTANT.USER_EMAIL_HAS_ALREADY_BEEN_REGISTERED, updateUserDto.email]);
            }
        } else {
            throw new BadRequestException(USER_CONSTANT.USER_NOT_FOUND);
        }
    }

    isAdmin(user: any): boolean {
        if (user) {
            const defaultCompany: ICompany = user.company.find((defaultComp) => defaultComp.default);
            if (defaultCompany.isAdmin) return true;
            return false;
        }
        return false;
    }

    async validateUserRecaptcha(req: Request, reCaptchaToken: string) {
        return await this.authService.validateUserRecaptcha(req, reCaptchaToken);
    }

    async verifyEmail(req: Request, verifyUuidDto: VerifyUuidDto) {
        const user = await this.findByVerification(verifyUuidDto.verification);
        await this.setUserAsVerified(user, verifyUuidDto.companyId);

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            accessToken: await this.authService.createAccessToken(user._id),
            refreshToken: await this.authService.createRefreshToken(req, user._id)
        };
    }

    async deleteVaccinatedUser(id: string, req: Request) {
        const { deletingRole } = req.query;
        const company = this.authService.getDefaultCompany(req);
        const query = {
            _id: id,
            company: {
                $elemMatch: {
                    companyId: company.companyId,
                    subscriptionType: ROLE[<string>deletingRole]
                }
            }
        };
        const user = await this.uModel.findOne(query);
        if (!user) throw new NotFoundException(USER_CONSTANT.USER_NOT_FOUND);
        await this.uModel.updateOne(query, {
            $set: {
                'company.$.isDeleted': true
            }
        });
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            const user = await this.uModel.findById(id);
            await this.userBcService.storeUserBc(user, bcUserDto, BC_PAYLOAD.DISABLE_USER);
        }

        await this.mailService.sendMail(user.email, EMAIL_CONSTANTS.FLO, EMAIL_CONSTANTS.TITLE_VACCINE_RECORD_DISABLED, config.MAIL_TYPES.USER_DISABLE_EMAIL, {
            user: user,
            subscriptionType: 'Vaccine Record',
            email: user.email,
            type: 'vaccine record'
        });
        return {
            success: true,
            message: USER_CONSTANT.USER_DISABLED
        };
    }

    async verifyEmailByAdmin(verifyEmailDto: VerifyEmailDto, req: Request): Promise<{ success: boolean; message: string }> {
        const logger = new Logger('VerifyEmailByAdmin');
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            if (!verifyEmailDto.channelId) {
                logger.error(CHANNEL_DETAIL.CHANNEL_ID_NOT_FOUND);
                throw new NotFoundException(CHANNEL_DETAIL.CHANNEL_ID_NOT_FOUND);
            }
        }
        const user = await this.UserModel.findById(verifyEmailDto.userId).exec();
        const alreadyHaveVerifiedSubscription = user.company.find((element) => element.verified);
        let randomPassword = Math.random().toString(36).slice(-8);
        let autoPassword = true;
        if (alreadyHaveVerifiedSubscription) {
            randomPassword = '[Use your current password to login, if forget use forget password to reset]';
            autoPassword = user.autoPassword;
        } else {
            if (!randomPassword) {
                randomPassword = Math.random().toString(36).slice(-8);
            }
            user.password = randomPassword;
        }
        await this.setUserAsVerified(user, verifyEmailDto.companyRowId);
        await this.organizationService.allowOrganization(verifyEmailDto.companyId);
        await this.organizationService.updateOrganizationStatus(verifyEmailDto.companyId, verifyEmailDto.subscriptionType, true);
        let mailResponse: { success: boolean; message: string };
        // save new password for user
        try {
            user.autoPassword = autoPassword;
            await user.save();
        } catch (error) {
            throw new Error(USER_CONSTANT.GENERATED_PASSWORD_FAILED_TO_SAVE);
        }
        const userSaved = await this.UserModel.findById(verifyEmailDto.userId).exec();

        const defaultCompany: ICompany = user.company.find((defaultComp) => defaultComp.default);
        const subcriptionTypeFull = await this.subsTypeService.getFullSubscription(defaultCompany.subscriptionType);
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const organization = user.company.find((defaultComp) => defaultComp.default);
            const channelId = verifyEmailDto.channelId;
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.userBcService.storeUserBc(userSaved, bcUserDto, BC_PAYLOAD.CREATE_USER);
            bcUserDto.enrollmentId = userSaved._id;
            bcUserDto.enrollmentSecret = randomPassword;
            await this.caService.userRegistration(bcUserDto, userSaved.company[0].staffingId[0] as string, organization.companyId.toString(), channelId);
        }
        await this.mailService
            .sendMail(user.email, EMAIL_CONSTANTS.FLO, EMAIL_CONSTANTS.TITLE_WELCOME, config.MAIL_TYPES.SUBSCRIBER_EMAIL, {
                user: user,
                subscriptionType: subcriptionTypeFull,
                email: user.email,
                password: randomPassword,
                clientAppURL: process.env.CLIENT_APP_URL
            })
            .then((res) => {
                mailResponse = res;
            });
        if (!mailResponse.success) {
            return {
                success: mailResponse.success,
                message: mailResponse.message
            };
        }
        return {
            success: mailResponse.success,
            message: 'Subscription mail sent to ' + user.firstName
        };
    }

    async verifyUserByOrganizationAdmin(verifyEmailDto: VerifyEmailDto, req: Request, staffingId?: string): Promise<{ success: boolean; message: string }> {
        if (this.isAdmin(req['user'])) {
            const user = await this.UserModel.findOne({
                _id: verifyEmailDto.userId,
                'company.companyId': req['user'].company.find((defCompany) => defCompany.default).companyId._id
            }).exec();
            if (!user) {
                throw new BadRequestException(USER_CONSTANT.USER_NOT_FOUND);
            }
            const alreadyHaveVerifiedSubscription = user.company.find((element) => element.verified);
            let randomPassword = Math.random().toString(36).slice(-8);
            let autoPassword = true;
            if (alreadyHaveVerifiedSubscription) {
                randomPassword = '[Use your current password to login, if forget use forget password to reset]';
                autoPassword = user.autoPassword;
            } else {
                if (!randomPassword) {
                    randomPassword = Math.random().toString(36).slice(-8);
                }
                user.password = randomPassword;
            }
            await this.setUserAsVerified(user, verifyEmailDto.companyRowId);
            let mailResponse: { success: boolean; message: string };
            // save new password for user
            try {
                user.autoPassword = autoPassword;
                await user.save();
            } catch (error) {
                throw new Error(USER_CONSTANT.PASSWORD_FAILED_TO_SAVE);
            }
            const defaultCompany: ICompany = user.company.find((defaultComp) => defaultComp.default);
            const subcriptionTypeFull = await this.subsTypeService.getFullSubscription(defaultCompany.subscriptionType);
            if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                const userDetail = await this.UserModel.findById(verifyEmailDto.userId).exec();
                const bcUserDto = new BcUserDto();
                bcUserDto.loggedInUserId = req['user']._id;
                bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
                bcUserDto.enrollmentId = userDetail._id;
                bcUserDto.enrollmentSecret = randomPassword;
                await Promise.all([this.userBcService.storeUserBc(userDetail, bcUserDto, BC_PAYLOAD.CREATE_USER), this.caService.userRegistration(bcUserDto, staffingId)]);
            }
            await this.mailService
                .sendMail(user.email, EMAIL_CONSTANTS.FLO, EMAIL_CONSTANTS.TITLE_WELCOME, config.MAIL_TYPES.SUBSCRIBER_EMAIL, {
                    user: user,
                    subscriptionType: subcriptionTypeFull,
                    email: user.email,
                    password: randomPassword,
                    clientAppURL: process.env.CLIENT_APP_URL
                })
                .then((res) => {
                    mailResponse = res;
                });
            if (!mailResponse.success) {
                return {
                    success: mailResponse.success,
                    message: mailResponse.message
                };
            }
            return {
                success: mailResponse.success,
                message: 'Subscription mail sent to ' + user.firstName
            };
        }
        throw new BadRequestException(USER_CONSTANT.UNABLE_TO_VERIFY_USER);
    }

    async enableUserByOrganizationAdmin(verifyEmailDto: VerifyEmailDto, req: Request): Promise<{ success: boolean; message: string }> {
        const defaultCompany = this.authService.getDefaultCompany(req);
        let user;
        if (verifyEmailDto.isRegisteredUser) {
            user = await this.UserModel.findById(verifyEmailDto.userId);
        } else {
            user = await this.UserModel.findOne({
                _id: verifyEmailDto.userId,
                'company.companyId': req['user'].company.find((defCompany) => defCompany.default).companyId._id
            }).exec();
            if (!user) {
                throw new BadRequestException(USER_CONSTANT.USER_NOT_FOUND);
            }
        }
        if (verifyEmailDto.isRegisteredUser) {
            await this.UserModel.updateOne(
                { _id: user._id, 'company._id': verifyEmailDto.companyRowId },
                {
                    $set: {
                        'company.$.isDeleted': false
                    }
                }
            );
            await this.organizationService.updateOrganizationStatus(verifyEmailDto.companyId, verifyEmailDto.subscriptionType, true);
        } else {
            const companyToUpdate = user.company.find((data) => data.companyId.toString() === defaultCompany.companyId.toString() && data.subscriptionType === verifyEmailDto.subscriptionType);
            const staffingToUpdate = getArraysComplement(companyToUpdate.deletedStaffingId, verifyEmailDto.staffingId);
            companyToUpdate.deletedStaffingId = staffingToUpdate;
            verifyEmailDto.staffingId.forEach((staffingId) => {
                if (!companyToUpdate.staffingId.includes(staffingId)) {
                    companyToUpdate.staffingId.push(staffingId);
                }
            });
            await user.save();
        }
        let mailResponse: { success: boolean; message: string };
        try {
            const userSaved = await user.save();
            if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                const bcUserDto = new BcUserDto();
                bcUserDto.loggedInUserId = req['user']._id;
                bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
                await Promise.all([this.userBcService.storeUserBc(userSaved, bcUserDto, BC_PAYLOAD.ENABLE_USER), this.caService.userReEnroll(new BcUserDto(userSaved._id), '')]);
            }
        } catch (error) {
            throw new Error(USER_CONSTANT.FAILED_TO_ENABLE_USER);
        }
        let subcriptionTypeFull;
        if (verifyEmailDto.subscriptionType && verifyEmailDto.subscriptionType === 'Vaccine Record') {
            subcriptionTypeFull = verifyEmailDto.subscriptionType;
        } else {
            subcriptionTypeFull = await this.subsTypeService.getFullSubscription(verifyEmailDto.isRegisteredUser ? verifyEmailDto.subscriptionType : defaultCompany.subscriptionType);
        }
        await this.mailService
            .sendMail(user.email, EMAIL_CONSTANTS.FLO, EMAIL_CONSTANTS.TITLE_WELCOME, config.MAIL_TYPES.USER_ENABLE_EMAIL, {
                user: user,
                subscriptionType: subcriptionTypeFull,
                email: user.email,
                clientAppURL: process.env.CLIENT_APP_URL,
                type: subcriptionTypeFull === 'Vaccine Record' ? 'vaccine record' : 'account'
            })
            .then((res) => {
                mailResponse = res;
            });
        if (!mailResponse.success) {
            return {
                success: mailResponse.success,
                message: mailResponse.message
            };
        }
        return {
            success: mailResponse.success,
            message: USER_CONSTANT.USER_ENABLED
        };
    }

    async setDefaultCompany(companyDto: SetDefaultCompanyDto, req: Request, res: Response) {
        const { _id, company } = req['user'];
        const companyRowId = company.find((comp) => comp.companyId.toString() === companyDto.companyId && comp.isDeleted === false && comp.verified === true)._id;
        if (_id) {
            await this.UserModel.updateMany({ _id: _id, 'company.default': true }, { 'company.$[].default': false });
            await this.UserModel.updateOne(
                { _id: _id, 'company._id': companyRowId },
                {
                    $set: {
                        'company.$.default': true
                    }
                }
            );
            const user = await this.uModel.findById(_id);
            await user.populate({
                path: 'company.companyId company.staffingId',
                populate: { path: 'featureAndAccess.featureId' }
            });
            const defaultCompany: ICompany = user.company.find((company) => company.default && company.verified);
            const organizationData: Organization = <Organization>defaultCompany.companyId;
            const roles = [];
            user.company.filter((company) => {
                if (company.verified && (<Organization>company.companyId)._id === organizationData._id) {
                    roles.push(company.subscriptionType);
                }
            });
            const refreshToken = await this.authService.createRefreshToken(req, user._id, organizationData._id);
            this.authService.setCookie(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, res);
            const userData = {
                id: user._id,
                roles: roles,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                autoPassword: user.autoPassword,
                companyName: organizationData.companyName,
                companyId: organizationData._id,
                staffingId: defaultCompany.staffingId,
                company: user.company,
                skill: user.skill,
                language: user.language,
                education: user.education,
                experience: user.experience
            };
            return userData;
        }
        throw new NotFoundException(USER_CONSTANT.USER_NOT_FOUND);
    }

    async login(req: Request, loginUserDto: LoginUserDto, res: Response) {
        if (process.env.RE_CAPTCHA_STATUS !== CAPTCHA_STATUS.DISABLED) {
            const captchaValidation: any = await this.validateUserRecaptcha(req, loginUserDto.reCaptchaToken);
            if (!captchaValidation) throw new BadRequestException(USER_CONSTANT.PLEASE_VERIFY_THAT_YOU_ARE_A_HUMAN);
        }
        const user = await this.findUserByEmail(loginUserDto.email);
        this.isUserBlocked(user);
        await this.checkPassword(loginUserDto.password, user);
        await this.passwordsAreMatch(user);

        // await user.populate([{ path: 'company.companyId ' }, { path: 'company.staffingId', populate: { path: 'featureAndAccess.featureId', strictPopulate: false } }]);
        await user.populate({
            path: 'company.staffingId',
            populate: { path: 'featureAndAccess.featureId', justOne: false }
        });
        let defaultCompany: ICompany = user.company.find((company) => company.default && company.verified && !company.isDeleted);
        await this.UserModel.updateMany({ _id: user._id, 'company.default': true }, { 'company.$[].default': false });
        let updatedUser;
        if (defaultCompany && !defaultCompany.isAdmin && !defaultCompany.staffingId.length) {
            defaultCompany = null;
        }
        if (!defaultCompany) {
            defaultCompany = user.company.find((company) => company.verified && !company.isDeleted && company.isAdmin);
            if (!defaultCompany) {
                throw new BadRequestException(USER_CONSTANT.RELATED_COMPANY_NOT_FOUND);
            }
            updatedUser = await this.UserModel.findOneAndUpdate(
                { _id: user._id, 'company._id': defaultCompany['_id'] },
                {
                    $set: {
                        'company.$.default': true
                    }
                },
                {
                    new: true
                }
            ).populate({
                path: 'company.companyId company.staffingId',
                populate: { path: 'featureAndAccess.featureId', justOne: false }
            });
        } else {
            updatedUser = await this.UserModel.findOneAndUpdate(
                { _id: user._id, 'company._id': defaultCompany['_id'] },
                {
                    $set: {
                        'company.$.default': true
                    }
                },
                {
                    new: true,
                    useFindAndModify: false
                }
            ).populate({
                path: 'company.companyId company.staffingId',
                populate: { path: 'featureAndAccess.featureId', justOne: false }
            });
        }
        const organizationData: Organization = <Organization>defaultCompany.companyId;
        const company = await this.organizationService.findOrganizationById(organizationData._id);
        const allowSubscription = company.isRejected ? [] : company.subscription.filter((enableSubscription) => enableSubscription.status).map((subs) => subs.type);
        const roles = [];
        let newStaffing = [];
        newStaffing = defaultCompany.staffingId;
        user.company.filter((company) => {
            if (company.verified && company.userAccept && !company.isDeleted && company.isAdmin && (<Organization>company.companyId)._id === organizationData._id) {
                roles.push(company.subscriptionType);
                newStaffing = [...newStaffing, ...company.staffingId];
            }
        });
        const enabledRoles = roles.filter((role) => allowSubscription.includes(role));

        if (!allowSubscription.some((element) => roles.includes(element)) && company.subscription && company.subscription.length) {
            throw new BadRequestException(USER_CONSTANT.RELATED_COMPANY_NOT_FOUND);
        }
        const refreshToken = await this.authService.createRefreshToken(req, user._id, organizationData._id);
        this.authService.setCookie(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, res);

        const userData = {
            id: user._id,
            roles: company.subscription && company.subscription.length ? enabledRoles : roles,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            autoPassword: user.autoPassword,
            companyName: organizationData.companyName,
            companyId: organizationData._id,
            staffingId: newStaffing,
            company: updatedUser.company,
            skill: user.skill,
            language: user.language,
            education: user.education,
            experience: user.experience,
            accessToken: await this.authService.createAccessToken(user._id)
        };
        return userData;
    }

    async logoutUser(req: Request, res: Response) {
        const refreshToken = req.cookies[COOKIE_KEYS.REFRESH_TOKEN];
        await this.authService.revokeRefreshToken(req);
        this.authService.destroyCookie(COOKIE_KEYS.REFRESH_TOKEN, res);
        return await this.authService.userNameFromRefreshToken(refreshToken);
    }

    async findAllUser(req: Request): Promise<any> {
        const userId = req['user']._id;
        const { page, limit, status, subscriptionType, companyUsers, unverifiedUsers, rejectedCompanies, blockedUsers, search, searchValue } = req.query;
        const searchQuery = search && search === 'true' && searchValue ? getSearchFilterWithRegexAll(searchValue, ['firstName', 'lastName', 'email', 'phone', 'company.subscriptionType']) : {};
        let query;
        if (blockedUsers && blockedUsers === 'true') {
            query = { loginAttempts: { $gt: this.LOGIN_ATTEMPTS_TO_BLOCK - 1 } };
            if (subscriptionType && subscriptionType !== 'all') {
                query = { ...query, 'company.subscriptionType': subscriptionType };
            }
        } else {
            if ((unverifiedUsers && unverifiedUsers === 'true') || (rejectedCompanies && rejectedCompanies === 'true')) {
                query = { verified: false, isRejected: rejectedCompanies === 'true' };
            } else {
                const verified = status && status.toString().toUpperCase() === 'VERIFIED' ? true : false;
                if (verified) {
                    query = {
                        $or: [{ isDeleted: false }, { isDeleted: null }],
                        verified: true
                    };
                } else {
                    query = { isDeleted: true, verified: true };
                }
            }
            if (subscriptionType && subscriptionType !== 'all') {
                if (subscriptionType === 'allSupervisors') {
                    query = {
                        ...query,
                        subscriptionType: 'supervisor'
                    };
                } else {
                    query = {
                        ...query,
                        isAdmin: companyUsers === 'true' ? false : true,
                        subscriptionType: subscriptionType
                    };
                }
            } else {
                query = {
                    ...query,
                    isAdmin: companyUsers === 'true' ? false : true,
                    ...(companyUsers === 'true'
                        ? {}
                        : {
                              subscriptionType: {
                                  $ne: ROLE.SUPER_ADMIN
                              }
                          })
                };
            }
            query = {
                _id: { $ne: userId },
                company: {
                    $elemMatch: query
                }
            };
        }

        const options = {
            select: 'firstName lastName jobTitle email phone country state city address zipCode company createdAt',
            sort: { updatedAt: -1 },
            populate: {
                path: 'company.companyId company.staffingId skill language education experience country state',
                select: '-countryCode -idNumber -phoneCode -states -countryId -countryObjectId -__v',
                populate: { path: 'featureAndAccess.featureId organizationUnitId' }
            },
            lean: true,
            limit: Number(limit),
            page: Number(page)
        };
        const users = await this.uModel.paginate({ ...query, ...searchQuery }, options);
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            users.docs = await this.userBcService.getBlockchainVerifiedUserList(users.docs, bcUserDto);
        }
        return users;
    }

    async findAllUserOfOrganization(req: Request) {
        const { page, limit, status, subscriptionType, search, searchValue } = req.query;
        const verified = status && status.toString().toUpperCase() === 'VERIFIED' ? true : false;
        const searchQuery = search && search === 'true' && searchValue ? getSearchFilterWithRegexAll(searchValue, ['firstName', 'lastName', 'email', 'zipCode', 'address']) : {};
        const user = req['user'];
        const filterTrainingStaffing = {
            staffingId: {
                $elemMatch: {
                    $nin: []
                }
            }
        };
        const query = {
            ...searchQuery,
            company: {
                $elemMatch: {
                    verified: true,
                    companyId: user.company.find((defCompany) => defCompany.default).companyId,
                    subscriptionType: subscriptionType,

                    ...(verified
                        ? {
                              $or: [filterTrainingStaffing, { isAdmin: true }]
                          }
                        : {
                              deletedStaffingId: {
                                  $elemMatch: {
                                      $nin: []
                                  }
                              }
                          })
                }
            }
        };

        if (!page && !limit) {
            return {
                docs: await this.uModel.find(query).select('firstName lastName email phone ')
            };
        }
        const options = {
            select: 'firstName lastName jobTitle email phone country state city address zipCode company',
            sort: { updatedAt: -1 },
            populate: {
                path: 'company.companyId company.staffingId company.deletedStaffingId skill language education experience country state',
                select: '-countryCode -idNumber -phoneCode -states -countryId -countryObjectId -__v ',
                populate: {
                    path: 'featureAndAccess.featureId organizationUnitId country state'
                }
            },
            lean: true,
            limit: Number(limit),
            page: Number(page)
        };

        const users = await this.uModel.paginate(query, options);

        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            users.docs = await this.userBcService.getBlockchainVerifiedUserList(users.docs, bcUserDto);
        }

        return users;
    }

    async getRecordsBySubscriptionType(req: Request): Promise<any> {
        const { subscriptionType, page, limit } = req.query;
        const query = {
            'company.subscriptionType': subscriptionType
        };
        const options = {
            select: 'firstName lastName jobTitle email phone country state city address zipCode company',
            sort: { updatedAt: -1 },
            populate: 'company.companyId',
            lean: true,
            limit: Number(limit),
            page: Number(page)
        };
        const user = await this.uModel.paginate(query, options);
        return user;
    }

    async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto, req: Request, res: Response) {
        const refreshToken = req.cookies[COOKIE_KEYS.REFRESH_TOKEN];
        let decoded: any;
        if (refreshToken && refreshAccessTokenDto.accessToken) {
            decoded = this.authService.verifyExpiredToken(refreshAccessTokenDto.accessToken, process.env.JWT_SECRET);
        }
        if (!decoded || !refreshToken) {
            throw new UnauthorizedException(USER_CONSTANT.USER_HAS_BEEN_LOGGED_OUT);
        }
        const userId = await this.authService.findRefreshToken(this.authService.decryptText(refreshToken));
        const user = await this.UserModel.findById(userId);
        if (!user) {
            throw new UnauthorizedException(USER_CONSTANT.USER_HAS_BEEN_LOGGED_OUT);
        }
        const newRefreshTokenData = await this.authService.updateRefreshToken(req);
        this.authService.setCookie(COOKIE_KEYS.REFRESH_TOKEN, newRefreshTokenData.refreshToken, res);
        return {
            accessToken: await this.authService.createAccessToken(user._id)
        };
    }

    async disableUserCompany(verifyEmailDto: VerifyEmailDto) {
        let userData;

        const user = await this.UserModel.findById(verifyEmailDto.userId);
        await this.UserModel.updateOne(
            { _id: user._id, 'company._id': verifyEmailDto.companyRowId },
            {
                $set: {
                    'company.$.isDeleted': true
                }
            }
        );
        try {
            userData = await user.save();
            if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                const user = await this.UserModel.findById(verifyEmailDto.userId);
                const company = user.company;
                let companyNotDeletedCount = 0;
                company.forEach((company) => {
                    if (!company.isDeleted) {
                        companyNotDeletedCount++;
                    }
                });
                if (companyNotDeletedCount == 0) {
                    await this.caService.revokeUserCert(new BcUserDto(userData._id), null);
                }
            }

            await this.organizationService.updateOrganizationStatus(verifyEmailDto.companyId, verifyEmailDto.subscriptionType, false);
        } catch (error) {
            throw new Error(USER_CONSTANT.FAILED_TO_ENABLE_USER);
        }

        const subscriptionTypeFull = await this.subsTypeService.getFullSubscription(verifyEmailDto.subscriptionType);
        await this.mailService.sendMail(userData.email, EMAIL_CONSTANTS.FLO, EMAIL_CONSTANTS.TITLE_ACCOUNT_DISABLED, config.MAIL_TYPES.USER_DISABLE_EMAIL, {
            user: userData,
            subscriptionType: subscriptionTypeFull,
            email: userData.email,
            type: 'account'
        });
        return {
            success: true,
            user,
            message: USER_CONSTANT.USER_DISABLED
        };
    }

    async findOrganizationUserActivity(req: Request): Promise<PaginateResult<IUserActivityResponse>> {
        const company = this.authService.getDefaultCompany(req);

        let query = {};
        const { loginOnly, search, searchValue } = req.query;
        if (company.subscriptionType !== ROLE.SUPER_ADMIN) {
            query = {
                company: <string>company.companyId
            };
        }
        if (loginOnly && loginOnly === 'true') {
            query = {
                ...query,
                $and: [{ expireIn: { $gte: new Date() } }, { $or: [{ revoke: { $eq: null } }, { revoke: { $exists: false } }] }]
            };
        }
        const searchQuery = search && search === 'true' && searchValue ? getSearchFilterWithRegexAll(searchValue, ['firstName', 'lastName', 'email', 'phone', 'fullName', 'createdDateTime', 'organization.name']) : {};
        const page = req.query.page && req.query.page !== '0' ? Number(req.query.page) : null;
        const limit = req.query.limit ? Number(req.query.limit) : null;

        if (page && limit) {
            const userActivityData = await this.RefreshTokenModel.aggregate([
                {
                    $match: query
                },
                ...populateField('users', 'userId', '_id'),
                ...populateField('organizations', 'company', '_id'),
                {
                    $addFields: {
                        userId: '$userId._id',
                        firstName: '$userId.firstName',
                        lastName: '$userId.lastName',
                        fullName: {
                            $concat: ['$userId.firstName', ' ', '$userId.lastName']
                        },
                        email: '$userId.email',
                        phone: '$userId.phone',
                        createdDateTime: {
                            $dateToString: {
                                format: '%Y-%m-%d %H:%M',
                                date: '$createdAt',
                                timezone: getClientTimezoneId(req)
                            }
                        },
                        loggedInDate: '$createdAt',
                        loggedOutDate: {
                            $cond: {
                                if: { $gt: ['$revoke', null] },
                                then: '$revoke',
                                else: {
                                    $cond: {
                                        if: { $lte: ['$expireIn', new Date()] },
                                        then: '$expireIn',
                                        else: null
                                    }
                                }
                            }
                        },
                        organization: {
                            id: '$company._id',
                            name: '$company.companyName'
                        }
                    }
                },
                {
                    $match: searchQuery
                },
                {
                    $project: {
                        userId: 1,
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        phone: 1,
                        loggedInDate: 1,
                        loggedOutDate: 1,
                        organization: 1
                    }
                },
                {
                    $sort: { loggedInDate: -1 }
                },
                {
                    $facet: {
                        metadata: [
                            { $count: 'total' },
                            {
                                $addFields: {
                                    page: page ? page : 1,
                                    limit: Number(limit) ? Number(limit) : 10
                                }
                            }
                        ],
                        data: [{ $skip: (page - 1) * limit }, { $limit: limit }]
                    }
                }
            ]);
            const options = { limit, page };
            const finalResult = getFinalPaginationResult(userActivityData, options);
            return finalResult;
        } else {
            const allUserData = await this.RefreshTokenModel.find({
                ...query,
                company: <string>company.companyId
            }).populate('userId company');
            return this.returnPaginatedUserActivity({
                docs: allUserData,
                total: allUserData.length,
                limit: allUserData.length,
                page: 1,
                pages: 1
            });
        }
    }

    async findAllUserCountData(): Promise<ILoginCount> {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const last3MonthStart = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        const last6MonthStart = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        const lastyearStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const todayLoginCount = await this.findLoginCount(today);
        const realtimeOnlineUserCount = await this.findRealtimeOnlineUserCount();
        const lastWeekLoginCount = await this.findLoginCount(lastWeekStart);
        const lastMonthLoginCount = await this.findLoginCount(lastMonthStart);
        const last3MonthLoginCount = await this.findLoginCount(last3MonthStart);
        const last6MonthLoginCount = await this.findLoginCount(last6MonthStart);
        const lastYearLoginCount = await this.findLoginCount(lastyearStart);
        const totalLoginUserCount = await this.findLoginCount();

        return {
            realtimeOnlineUserCount,
            todayLoginCount,
            lastWeekLoginCount,
            lastMonthLoginCount,
            last3MonthLoginCount,
            last6MonthLoginCount,
            lastYearLoginCount,
            totalLoginUserCount
        };
    }

    async findLoginCount(date?: Date): Promise<number> {
        const group = [{ $group: { _id: null, loginCount: { $addToSet: '$userId' } } }];
        const project = [{ $project: { totalLogins: { $size: '$loginCount' } } }];
        if (date) {
            const logins = await this.RefreshTokenModel.aggregate([{ $match: { createdAt: { $gte: date } } }, ...group, ...project]);
            return logins.length ? logins[0].totalLogins : 0;
        } else {
            const logins = await this.RefreshTokenModel.aggregate([...group, ...project]);
            return logins.length ? logins[0].totalLogins : 0;
        }
    }

    async findRealtimeOnlineUserCount(): Promise<number> {
        const query = {
            $and: [{ expireIn: { $gte: new Date() } }, { $or: [{ revoke: { $eq: null } }, { revoke: { $exists: false } }] }]
        };
        const data = await this.RefreshTokenModel.find(query);
        return data && data.length ? data.length : 0;
    }

    returnPaginatedUserActivity(userActivity: PaginateResult<RefreshToken>): PaginateResult<IUserActivityResponse> {
        return {
            docs: userActivity.docs.map((data) => this.buildUserActivityResponse(data)),
            total: userActivity.total,
            limit: userActivity.limit,
            page: userActivity.page,
            pages: userActivity.pages
        };
    }

    buildUserActivityResponse(refreshTokenData: RefreshToken): IUserActivityResponse {
        return {
            userId: refreshTokenData.userId['_id'],
            firstName: refreshTokenData.userId['firstName'] || '',
            lastName: refreshTokenData.userId['lastName'] || '',
            email: refreshTokenData.userId['email'] || '',
            phone: refreshTokenData.userId['phone'] || '',
            loggedInDate: refreshTokenData.createdAt || null,
            loggedOutDate: refreshTokenData.revoke || new Date(refreshTokenData.expireIn) < new Date() ? refreshTokenData.expireIn : null,
            company: refreshTokenData.company,
            organization: {
                id: refreshTokenData.company['_id'] || '',
                name: refreshTokenData.company['companyName'] || ''
            }
        };
    }

    findUserProfile(req: Request): any {
        return this.getUserDataByJWT(req).then(
            (data) => {
                return data;
            },
            (err) => {
                throw err;
            }
        );
    }

    async findUserData(userId: string, req: Request) {
        let userData: any = await this.UserModel.findById(userId);
        let blockchainVerified = false;
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            blockchainVerified = await this.userBcService.getBlockchainVerifiedUser(userData, bcUserDto);
            userData = this.buildRegistrationInfo(userData);
            return { ...userData, blockchainVerified };
        }
        userData = this.buildRegistrationInfo(userData);
        return userData;
    }

    protected async getUserDataByJWT(req: Request) {
        const tokenExtractor = this.authService.returnJwtExtractor();
        const token = tokenExtractor(req);
        if (token) {
            const decoded = await this.authService.verifyToken(token, process.env.JWT_SECRET);
            if (decoded) {
                let user: any = await this.UserModel.findOne({
                    _id: decoded.userId,
                    company: { $elemMatch: { default: true } }
                })
                    .select('id firstName lastName jobTitle email phone country state city address zipCode company userId birthDate skill language education experience')
                    .populate({
                        path: 'company.companyId skill language education experience country state',
                        select: 'companyName country state city address zipCode companyLogo contributionForApp helpNeededFromApp aboutOrganization createdAt title school degree fieldOfStudy grade startYear endYear employmentType company location startDate endDate createdAt updatedAt userId status name',
                        populate: { path: 'country state', select: 'name' }
                    })
                    .populate({
                        path: 'company.staffingId',
                        select: 'staffingName organizationUnitId name',
                        populate: {
                            path: 'organizationUnitId',
                            select: 'unitName unitDescription'
                        }
                    });
                const userCompany = user.company.find((defaultUser) => defaultUser.default);
                const defaultCompany: Organization = <Organization>userCompany.companyId;
                if (!user) {
                    throw new NotFoundException(USER_CONSTANT.USER_NOT_FOUND);
                }
                this.isUserBlocked(user);
                let bcVerified = false;
                user = { ...user._doc };
                if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                    if (user) {
                        const bcUserDto = new BcUserDto();
                        bcUserDto.loggedInUserId = req['user']._id;
                        bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
                        const data = await Promise.all([this.experienceBcService.getBlockchainVerifiedList(user.experience, bcUserDto), this.educationBcService.getBlockchainVerifiedList(user.education, bcUserDto)]);
                        const experience = data[0];
                        const education = data[1];
                        user = { ...user, experience, education };
                        bcVerified = await this.userBcService.getBlockchainVerifiedUser(user, bcUserDto);
                    }
                }
                return {
                    ...user,
                    company: {
                        ...userCompany['_doc'],
                        companyId: userCompany.subscriptionType !== 'vaccinated-user' ? defaultCompany : ''
                    },
                    blockchainVerified: bcVerified
                };
            }
        }
    }

    async changePassword(req: Request, resetActivationPasswordDto: ChangePasswordDto): Promise<IUserData> {
        const { password, currentPassword } = resetActivationPasswordDto;
        const tokenExtractor = this.authService.returnJwtExtractor();
        const token = tokenExtractor(req);
        let user;
        if (token) {
            const decoded = await this.authService.verifyToken(token, process.env.JWT_SECRET);
            if (decoded) {
                user = await this.UserModel.findOne({ _id: decoded.userId });
                if (!user) {
                    throw new NotFoundException(USER_CONSTANT.USER_NOT_FOUND);
                }
                this.isUserBlocked(user);
                try {
                    await this.checkPassword(currentPassword, user);
                    if (currentPassword === password) {
                        throw new BadRequestException(USER_CONSTANT.SAME_PASSWORD);
                    }
                } catch (err) {
                    if (err.message === USER_CONSTANT.SAME_PASSWORD) {
                        throw new BadRequestException(USER_CONSTANT.YOUR_NEW_PASSWORD_IS_SAME_AS_CURRENT_PASSWORD);
                    } else {
                        throw new BadRequestException(USER_CONSTANT.INCORRECT_PASSWORD);
                    }
                }
                await this.passwordsAreMatch(user);
                user.password = password;
                user.autoPassword = false;
                await user.save();
            }
        }

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            accessToken: await this.authService.createAccessToken(user._id)
        };
    }

    async resetPassword(req: Request, resetPasswordDto: ResetPasswordDto): Promise<IUserData> {
        const { resetToken, password } = resetPasswordDto;
        let user;
        let decoded;
        if (resetToken) {
            try {
                decoded = await this.authService.verifyToken(resetToken, process.env.RESET_PASSWORD_SECRET);
            } catch (error) {
                throw new BadRequestException(USER_CONSTANT.LINK_EXPIRED);
            }
            if (decoded) {
                try {
                    user = await this.UserModel.findOne({ resetLink: resetToken });
                    user.autoPassword = false;
                    user.password = password;
                    user.resetLink = '';
                    await user.save();
                } catch (error) {
                    throw new BadRequestException(USER_CONSTANT.RESET_PASSWORD_LINK_ERROR);
                }
            }
        }

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
    }

    async forgetPassword(req: Request, forgetPasswordDto: ForgetPasswordDto): Promise<{ success: boolean; message: string }> {
        if (process.env.RE_CAPTCHA_STATUS !== CAPTCHA_STATUS.DISABLED) {
            const captchaValidation: any = await this.validateUserRecaptcha(req, forgetPasswordDto.reCaptchaToken);
            if (!captchaValidation) throw new BadRequestException(USER_CONSTANT.PLEASE_VERIFY_THAT_YOU_ARE_A_HUMAN);
        }
        let user;
        const response = {
            success: true,
            message: 'Email has been sent, kindly follow the instruction'
        };
        try {
            user = await this.findUserByEmail(forgetPasswordDto.email);
        } catch (error) {
            return response;
        }
        const token = await this.authService.createResetToken(user._id);
        const forgetLink = `${process.env.CLIENT_APP_URL}/auth/reset-password/${token}`;
        try {
            await user
                .updateOne({ resetLink: token })
                .then(async () => {
                    await this.mailService.sendMail(user.email, 'Forgot Password', 'Reset Password Link', config.MAIL_TYPES.FORGET_PASSWORD_EMAIL, {
                        userFirstName: user.firstName,
                        forgetPasswordLink: forgetLink
                    });
                })
                .catch(() => {
                    throw new BadRequestException(USER_CONSTANT.RESET_PASSWORD_LINK_ERROR);
                });
        } catch (error) {
            return response;
        }
        return response;
    }

    async findOrganizationIdByUser(id: string) {
        const user = await this.UserModel.findOne({
            _id: id,
            'company.default': true,
            'company.verified': true
        }).exec();
        return user.company.find((defaultUser) => defaultUser.default).companyId;
    }

    async isEmailUnique(email: string) {
        const user = await this.UserModel.findOne({ email });
        if (user) {
            return false;
        }
        return true;
    }

    private setRegistrationInfo(user): any {
        user.verification = v4();
        user.verificationExpires = addHours(new Date(), this.HOURS_TO_VERIFY);
    }

    buildRegistrationInfo(user): any {
        const userRegistrationInfo = {
            id: user._id,
            roles: user.roles,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            country: user.country,
            state: user.state,
            city: user.city,
            address: user.address,
            zipCode: user.zipCode,
            companyID: user.companyID,
            jobTitle: user.jobTitle,
            sponsorOrganizationName: user.sponsorOrganizationName,
            verified: user.verified,
            blockchainVerified: user.blockchainVerified ? user.blockchainVerified : false
        };
        return userRegistrationInfo;
    }

    private async findByVerification(verification: string): Promise<IUser> {
        const user = await this.UserModel.findOne({
            verification,
            verified: false,
            verificationExpires: { $gt: new Date() }
        });
        if (!user) {
            throw new BadRequestException(COMMON_ERROR.BAD_REQUEST);
        }
        return user;
    }

    async findVerifiedUserByEmail(email: string): Promise<IUser> {
        const user = await this.UserModel.findOne({
            email,
            'company.verified': true
        });
        if (!user) {
            throw new NotFoundException(USER_CONSTANT.USER_NOT_FOUND);
        }
        return user;
    }

    async findByEmail(email: string): Promise<IUser> {
        const user = await this.UserModel.findOne({ email }).select('-password');
        if (!user) {
            throw new NotFoundException(USER_CONSTANT.EMAIL_NOT_FOUND);
        }
        return user;
    }

    private async setUserAsVerified(user, companyId: string) {
        await this.UserModel.findOneAndUpdate(
            { _id: user._id, 'company._id': companyId },
            {
                $set: {
                    'company.$.verified': true,
                    'company.$.userAccept': true,
                    'company.$.isDeleted': false,
                    'company.$.isRejected': false
                }
            },
            {
                new: true
            }
        );
    }

    private async findUserByEmail(email: string): Promise<IUser> {
        const user = await this.UserModel.findOne({ email });
        if (!user) {
            throw new NotFoundException(USER_CONSTANT.WRONG_EMAIL_OR_PASSWORD);
        }
        const isVerified: boolean = user.company.some((verifiedCompany) => {
            return verifiedCompany.verified && !verifiedCompany.isDeleted;
        });
        if (!isVerified) {
            throw new BadRequestException(USER_CONSTANT.YOUR_ACCOUNT_IS_NOT_ACTIVE);
        }
        return user;
    }

    private async checkPassword(attemptPass: string, user) {
        const match = await bcrypt.compare(attemptPass, user.password);
        if (!match) {
            await this.passwordsDoNotMatch(user);
            throw new NotFoundException([USER_CONSTANT.WRONG_EMAIL_OR_PASSWORD]);
        }
        return match;
    }

    private isUserBlocked(user) {
        if (user.blockExpires > Date.now()) {
            throw new ConflictException([USER_CONSTANT.USER_HAS_BEEN_BLOCKED_ATTEMPT, getHourMinuteDiff(user.blockExpires)]);
        }
    }

    private async passwordsDoNotMatch(user) {
        user.loginAttempts += 1;
        await user.save();
        const remainingAttempts = this.LOGIN_ATTEMPTS_TO_BLOCK - user.loginAttempts;
        if (user.loginAttempts >= this.LOGIN_ATTEMPTS_TO_BLOCK) {
            await this.blockUser(user);
            throw new ConflictException([USER_CONSTANT.USER_HAS_BEEN_BLOCKED_ATTEMPT, getHourMinuteDiff(user.blockExpires)]);
        }
        if (remainingAttempts <= 3) {
            throw new NotFoundException([USER_CONSTANT.WRONG_EMAIL_OR_PASSWORD_ATTEMPT, remainingAttempts]);
        }
    }

    private async blockUser(user) {
        user.blockExpires = addHours(new Date(), this.HOURS_TO_BLOCK);
        await user.save();
    }

    private async passwordsAreMatch(user) {
        user.loginAttempts = 0;
        await user.save();
    }

    async getAdminOfCompany(companyName: string) {
        const orgDetail = await this.organizationService.getOrganizationByName(companyName);
        if (orgDetail) {
            const admin = await this.UserModel.findOne({
                companyID: orgDetail._id,
                verified: true,
                staffingId: { $exists: true, $size: 0 }
            });
            if (admin) {
                return {
                    currentOwner: admin._id,
                    company: orgDetail._id
                };
            } else {
                return {
                    currentOwner: null,
                    company: orgDetail._id
                };
            }
        } else {
            throw new NotFoundException(USER_CONSTANT.COMPANY_NOT_FOUND);
        }
    }

    async unVerifyAllUsersByCompanyId(companyID: string) {
        return await this.UserModel.updateMany({ companyID: companyID }, { verified: false, isAdmin: false });
    }

    async createUserByTransferToken(req: Request, createUserByTransferDto: CreateUserByTransferDto) {
        const captchaValidation: any = await this.validateUserRecaptcha(req, createUserByTransferDto.reCaptchaToken);
        if (!captchaValidation) throw new BadRequestException(USER_CONSTANT.PLEASE_VERIFY_THAT_YOU_ARE_A_HUMAN);
        const transferData = await this.validateTransferToken(createUserByTransferDto.transferToken);
        const { email, subscriptionType } = <IReportIssue>transferData.issue;
        const { _id: companyID } = <Organization>transferData.company;
        const user = {
            email,
            ...createUserByTransferDto,
            company: [
                {
                    companyId: companyID,
                    subscriptionType,
                    verified: false,
                    default: true,
                    isAdmin: subscriptionType === 'vaccination-appointment' ? false : true
                }
            ]
        };
        const newUser = new this.UserModel(user);
        const isEmailUnique = await this.isEmailUnique(user.email);
        if (!isEmailUnique) throw new BadRequestException([USER_CONSTANT.USER_EMAIL_HAS_ALREADY_BEEN_REGISTERED, user.email]);

        this.setRegistrationInfo(newUser);
        const savedUser = await newUser.save();
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            bcUserDto.enrollmentId = savedUser._id;
            bcUserDto.enrollmentSecret = newUser.password;
            await this.caService.userRegistration(bcUserDto, null);
        }
        await this.companyTransferService.useTransferToken(transferData._id);
        return this.buildRegistrationInfo(newUser);
    }

    async validateTransferToken(transferToken: string) {
        const transferData = await this.companyTransferService.getTransferDataByToken(transferToken);
        if (transferData) {
            return transferData;
        } else {
            throw new NotFoundException(USER_CONSTANT.TRANSFER_TOKEN_EXIPRED_OR_INVALID);
        }
    }

    async addSubscriptionType(subscriptionTypeDto: SubscriptionTypeDto, req: Request) {
        let newSubscription = [];
        let removedSubscription = [];
        const user = await this.UserModel.findById(subscriptionTypeDto.userId);
        if (user) {
            await this.organizationService.addSubscription(subscriptionTypeDto.companyId, subscriptionTypeDto.subscriptionType);
            const currentCompany = user.company.filter((company) => company.companyId.toString() === subscriptionTypeDto.companyId);
            newSubscription = subscriptionTypeDto.subscriptionType.filter((subType) => !currentCompany.some((com) => com.subscriptionType === subType));
            const removedSubscriptionData = currentCompany.filter((com) => !subscriptionTypeDto.subscriptionType.includes(com.subscriptionType) && com.subscriptionType !== 'vaccinated-user' && com.subscriptionType !== 'super-admin');
            removedSubscription = removedSubscriptionData.map((company) => company.subscriptionType);
            if (newSubscription.length || removedSubscription.length) {
                await this.UserModel.updateOne(
                    {
                        _id: subscriptionTypeDto.userId
                    },
                    {
                        $pullAll: {
                            company: removedSubscriptionData
                        }
                    }
                );
                const updatedResponse = await this.UserModel.findOneAndUpdate(
                    {
                        _id: subscriptionTypeDto.userId
                    },
                    {
                        $push: {
                            company: newSubscription.map((subscriptionType) => {
                                return {
                                    staffingId: [],
                                    default: false,
                                    userAccept: true,
                                    verified: true,
                                    isDeleted: false,
                                    isAdmin: true,
                                    companyId: subscriptionTypeDto.companyId,
                                    subscriptionType
                                };
                            }) as any
                        }
                    },
                    {
                        new: true,
                        useFindAndModify: false
                    }
                ).select('-password');
                await this.mailService.sendMail(user.email, 'Subscription updated', 'Updated Subscription Type', config.MAIL_TYPES.SUBSCRIPTION_UPDATED, {
                    email: user.email,
                    currentCompany: (await this.organizationService.findOrganizationById(currentCompany[0].companyId as string)).companyName,
                    currentSubscription: updatedResponse.company.filter((com) => com.companyId.toString() === currentCompany[0].companyId.toString()).map((company) => fullSubscriptionType[company.subscriptionType]) as Array<string>,
                    newSubscription: newSubscription.map((subscription) => fullSubscriptionType[subscription]) as Array<string>,
                    removedSubscription: removedSubscription.map((subscription) => fullSubscriptionType[subscription]) as Array<string>
                });
                if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
                    const user = await this.UserModel.findById(subscriptionTypeDto.userId);
                    const bcUserDto = new BcUserDto();
                    bcUserDto.loggedInUserId = req['user']._id;
                    bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
                    await this.userBcService.storeUserBc(user, bcUserDto, BC_PAYLOAD.UPDATE_SUBSCRIPTION);
                }
                return updatedResponse;
            }
            return;
        }
        throw new NotFoundException(USER_CONSTANT.USER_NOT_FOUND);
    }

    async addCompanyToUser(addCompanyDto: AddCompanyDto, req: Request) {
        const loginUserDefaultCompany = this.authService.getDefaultCompany(req);
        const user = await this.UserModel.findById(addCompanyDto.userId);
        user.sponsorOrganizationName = addCompanyDto.sponsorOrganizationName;
        const companyName = (await this.organizationService.findOrganizationById(<string>loginUserDefaultCompany.companyId)).companyName;
        const userHasCompany = user.company.find((userCompany) => userCompany.companyId.toString() === loginUserDefaultCompany.companyId.toString() && userCompany.subscriptionType === (addCompanyDto.subscription ? addCompanyDto.subscription : loginUserDefaultCompany.subscriptionType));
        const staffingData = await this.staffingService.findNameFromArray(addCompanyDto.staffingId);
        const staffing = [];
        staffingData.forEach((element) => {
            staffing.push(element.staffingName);
        });
        const token = await this.verificationService.createAcceptToken(user, companyName, loginUserDefaultCompany.subscriptionType, staffing);
        if (userHasCompany) {
            let duplicateCount = 0;
            let disabledStaffingCount = 0;
            addCompanyDto.staffingId.forEach((newStaffing) => {
                if (userHasCompany.staffingId.indexOf(newStaffing) === -1) {
                    userHasCompany.staffingId.push(newStaffing);
                } else {
                    duplicateCount += 1;
                }
                if (userHasCompany.deletedStaffingId.indexOf(newStaffing) > -1) {
                    disabledStaffingCount += 1;
                }
            });

            const isUserCompanyAdmin = user.company.some((userCompany) => userCompany.companyId.toString() === loginUserDefaultCompany.companyId.toString() && userCompany.isAdmin === true);
            if (isUserCompanyAdmin) {
                throw new ConflictException(USER_CONSTANT.CAN_NOT_ADD_COMPANY_ADMIN_AS_COMPANY_USER);
            }

            const isUserLoggedInUser = user.company.some((userCompany) => userCompany.companyId.toString() === loginUserDefaultCompany.companyId.toString() && req['user']._id.toString() === addCompanyDto.userId.toString());
            if (isUserLoggedInUser) {
                throw new ConflictException(USER_CONSTANT.CAN_NOT_ADD_YOURSELF_AS_COMPANY_USER);
            }

            if (duplicateCount === userHasCompany.staffingId.length || disabledStaffingCount > 0) {
                throw new ConflictException(USER_CONSTANT.USER_ALREADY_EXIST_WITH_THOSE_STAFFING);
            }
            user.company = user.company.map((userCompany) => {
                if (userCompany.companyId === loginUserDefaultCompany.companyId) {
                    return userHasCompany;
                }
                return userCompany;
            });
        } else {
            user.company.push({
                companyId: loginUserDefaultCompany.companyId,
                default: false,
                isAdmin: false,
                staffingId: addCompanyDto.staffingId,
                subscriptionType: addCompanyDto.subscription ? addCompanyDto.subscription : loginUserDefaultCompany.subscriptionType,
                userAccept: false,
                verified: true,
                isDeleted: false,
                isRejected: false,
                userAcceptToken: token.userAcceptToken
            });
        }
        await this.mailService.sendMail(user.email, EMAIL_CONSTANTS.FLO, EMAIL_CONSTANTS.TITLE_WELCOME, config.MAIL_TYPES.USER_ACCEPT_EMAIL, {
            user: user,
            email: user.email,
            requestedBy: companyName,
            userName: user.firstName,
            roles: staffing.join(),
            subscriptionType: await this.subsTypeService.getFullSubscription(addCompanyDto.subscription ? addCompanyDto.subscription : loginUserDefaultCompany.subscriptionType),
            activationLink: process.env.CLIENT_APP_URL + `user-accept/${token.userAcceptToken}`
        });
        const userSaved: any = (await user.save()).populate('country state');
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            bcUserDto.enrollmentId = user._id;
            bcUserDto.enrollmentSecret = user._id;
            await Promise.all([this.userBcService.storeUserBc(userSaved, bcUserDto, BC_PAYLOAD.UPDATE_USER), this.caService.userRegistration(bcUserDto, addCompanyDto.staffingId[0])]);
            userSaved.blockchainVerified = await this.userBcService.getBlockchainVerifiedUser(userSaved, bcUserDto);
        }
        const resUser = this.buildRegistrationInfo(userSaved);
        return { ...resUser, _id: resUser.id };
    }

    async verifyUseraccept(token: string) {
        const userAccept = await this.verificationService.setUserAccept(token);
        if (!userAccept) {
            return new BadRequestException(VERIFICATION_CONSTANT.INVALID_REQUEST);
        }
        await this.UserModel.updateOne(
            {
                email: userAccept.email,
                'company.userAcceptToken': userAccept.userAcceptToken
            },
            {
                $set: {
                    'company.$.userAccept': true,
                    'company.$.userAcceptToken': ''
                }
            }
        );
        return true;
    }

    async deleteUserByOrganizationAdmin(userId: string, req: Request, staffingId?: string) {
        const company = this.authService.getDefaultCompany(req);
        const user = await this.UserModel.updateMany(
            {
                _id: userId,
                'company.verified': true,
                'company.companyId': company.companyId,
                'company.isAdmin': false
            },
            { 'company.$[].isDeleted': true }
        );
        if (!user) {
            throw new BadRequestException(USER_CONSTANT.USER_NOT_FOUND);
        }
        const userData = await this.UserModel.findById(userId).select('email');
        const subcriptionTypeFull = await this.subsTypeService.getFullSubscription(company.subscriptionType);
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const user = await this.uModel.findById(userId);
            const company = user.company;
            let companyNotDeletedCount = 0;
            company.forEach((company) => {
                if (!company.isDeleted) {
                    companyNotDeletedCount++;
                }
            });
            if (companyNotDeletedCount == 0) {
                await this.caService.revokeUserCert(new BcUserDto(userData._id), staffingId);
            }
        }
        await this.mailService.sendMail(userData.email, EMAIL_CONSTANTS.FLO, EMAIL_CONSTANTS.TITLE_ACCOUNT_DISABLED, config.MAIL_TYPES.USER_DISABLE_EMAIL, {
            user: userData,
            subscriptionType: subcriptionTypeFull,
            email: userData.email,
            type: 'account'
        });
        return {
            success: true,
            message: USER_CONSTANT.USER_DISABLED
        };
    }

    async disableUserByOrganizationAdmin(verifyEmailDto: VerifyEmailDto, req: Request) {
        const company = this.authService.getDefaultCompany(req);
        const user = await this.UserModel.findOne({
            _id: verifyEmailDto.userId,
            'company.companyId': company.companyId,
            'company.subscriptionType': verifyEmailDto.subscriptionType
        }).exec();
        if (!user) {
            throw new BadRequestException(USER_CONSTANT.USER_NOT_FOUND);
        }
        const companyToUpdate = user.company.find((data) => data.companyId.toString() === company.companyId.toString() && data.subscriptionType === verifyEmailDto.subscriptionType);
        const staffingToUpdate = getArraysComplement(companyToUpdate.staffingId as string[], verifyEmailDto.staffingId);
        companyToUpdate.staffingId = staffingToUpdate;
        if (companyToUpdate.isAdmin) {
            throw new BadRequestException(USER_CONSTANT.CANNOT_DISABLE_ADMIN);
        }
        verifyEmailDto.staffingId.forEach((staffingId) => {
            if (!companyToUpdate.deletedStaffingId.includes(staffingId)) {
                companyToUpdate.deletedStaffingId.push(staffingId);
            }
        });
        await user.save();

        const userData = await this.UserModel.findById(verifyEmailDto.userId).select('email');
        const subcriptionTypeFull = await this.subsTypeService.getFullSubscription(verifyEmailDto.subscriptionType);
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            const user = await this.uModel.findById(verifyEmailDto.userId);
            await Promise.all([this.userBcService.storeUserBc(user, bcUserDto, BC_PAYLOAD.DISABLE_USER), this.caService.revokeUserCert(new BcUserDto(verifyEmailDto.userId), null)]);
        }
        await this.mailService.sendMail(userData.email, EMAIL_CONSTANTS.FLO, EMAIL_CONSTANTS.TITLE_ACCOUNT_DISABLED, config.MAIL_TYPES.USER_DISABLE_EMAIL, {
            user: userData,
            subscriptionType: subcriptionTypeFull,
            email: userData.email,
            type: 'account'
        });
        return {
            success: true,
            message: USER_CONSTANT.USER_DISABLED
        };
    }

    async createUserSequence(createSequenceDto: CreateUserSequenceDto): Promise<IUserSequence> {
        const newSequence = new this.UserSequenceModel(createSequenceDto);
        return await newSequence.save();
    }

    async getNextSequence(id: string): Promise<IUserSequence> {
        let seqDetail: IUserSequence;
        seqDetail = await this.UserSequenceModel.findOne({ organizationId: id });
        if (!seqDetail) {
            const organization = await this.organizationService.findOrganizationById(id);
            const acronym = this.authService.getCompanyAcronym(organization.companyName);
            const orgCode = `${acronym}-${this.getRandomNumber()}`;
            seqDetail = await this.createUserSequence({
                organizationId: id,
                organizationCode: orgCode,
                currentSeq: 1,
                incrementBy: 1
            });
        }
        return seqDetail;
    }

    getRandomNumber(): number {
        return Math.floor(Math.random() * 99);
    }

    async updateSequence(seqObj: IUserSequence): Promise<IUserSequence> {
        const { _id, currentSeq, incrementBy } = seqObj;
        await this.UserSequenceModel.updateOne({ _id }, { currentSeq: currentSeq + incrementBy }, { new: true }).exec();
        return await this.UserSequenceModel.findById(_id);
    }

    async getUserBySequence(sequenceId: string): Promise<IUser> {
        const userDetail = await this.uModel.findOne({ userId: sequenceId }).select('firstName lastName country jobTitle userId ').populate({ path: 'company.companyId', select: 'companyName' });
        if (!userDetail) {
            throw new NotFoundException(USER_CONSTANT.USER_NOT_FOUND);
        }
        return userDetail;
    }

    getStaffingNameFromUserCompany(company: Array<ICompany>, loginUserCompanyId: string, verified: boolean) {
        const requiredCompany = company.find((com) => (<Organization>com.companyId)._id.toString() === loginUserCompanyId.toString());
        if (verified) {
            return requiredCompany.staffingId
                .filter((trainingStaffing) => [].includes(trainingStaffing['_id'].toString()))
                .map((staff: any) => staff.staffingName)
                .join(', ');
        }
        return requiredCompany.deletedStaffingId
            .filter((trainingStaffing) => [].includes(trainingStaffing['_id'].toString()))
            .map((staff: any) => staff.staffingName)
            .join(', ');
    }

    async addSkill(skillDto: AddSkillDto, req: Request): Promise<any> {
        const user = await this.findVerifiedUserByEmail(skillDto.email);
        user.skill = skillDto.skill;
        const savedUser = await user.save();
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.userBcService.storeUserBc(savedUser, bcUserDto, BC_PAYLOAD.ADD_SKILL);
        }
        if (!savedUser) throw new BadRequestException(USER_CONSTANT.FAILED_TO_ADD_SKILLS);
        return {
            message: USER_CONSTANT.SUCCESSFULLY_ADDED_SKILLS,
            data: await this.findUserWithPopulatedFields(savedUser._id, 'skill')
        };
    }

    async addLanguage(languageDto: AddLanguageDto, req: Request): Promise<any> {
        const user = await this.findVerifiedUserByEmail(languageDto.email);
        user.language = languageDto.language;
        const savedUser = await user.save();
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.userBcService.storeUserBc(savedUser, bcUserDto, BC_PAYLOAD.ADD_LANGUAGE);
        }
        if (!savedUser) throw new BadRequestException(USER_CONSTANT.FAILED_TO_ADD_LANGUAGES);
        return {
            message: USER_CONSTANT.SUCCESSFULLY_ADDED_LANGUAGES,
            data: await this.findUserWithPopulatedFields(savedUser._id, 'language')
        };
    }

    async addEducation(educationDto: AddEducationDto, req: Request): Promise<any> {
        const user = await this.findVerifiedUserByEmail(educationDto.email);
        user.education = educationDto.education;
        const savedUser = await user.save();
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.userBcService.storeUserBc(savedUser, bcUserDto, BC_PAYLOAD.ADD_EDUCATION);
        }
        if (!savedUser) throw new BadRequestException(USER_CONSTANT.FAILED_TO_ADD_EDUCATION);
        return await this.findUserWithPopulatedFields(savedUser._id, 'education');
    }

    async addExperience(experienceDto: AddExperienceDto, req: Request): Promise<any> {
        const user = await this.findVerifiedUserByEmail(experienceDto.email);
        user.experience = experienceDto.experience;
        const savedUser = await user.save();
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.userBcService.storeUserBc(savedUser, bcUserDto, BC_PAYLOAD.ADD_EXPERIENCE);
        }
        if (!savedUser) throw new BadRequestException(USER_CONSTANT.FAILED_TO_ADD_EXPERIENCE);
        return await this.findUserWithPopulatedFields(savedUser._id, 'experience');
    }

    async removeEducation(educationDto: RemoveEducationDto, req: Request): Promise<any> {
        const user = await this.findVerifiedUserByEmail(educationDto.email);
        const userEducation = user.education;
        const index = userEducation.indexOf(educationDto.educationId);
        if (index > -1) userEducation.splice(index, 1);
        user.education = userEducation;
        const savedUser = await user.save();
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.userBcService.storeUserBc(savedUser, bcUserDto, BC_PAYLOAD.REMOVE_EDUCATION);
        }
        if (!savedUser) throw new BadRequestException(USER_CONSTANT.FAILED_TO_REMOVE_EDUCATION);
        return await this.findUserWithPopulatedFields(savedUser._id, 'education');
    }

    async removeExperience(experienceDto: RemoveExperienceDto, req: Request): Promise<any> {
        const user = await this.findVerifiedUserByEmail(experienceDto.email);
        const userExperience = user.experience;
        const index = userExperience.indexOf(experienceDto.experienceId);
        if (index > -1) userExperience.splice(index, 1);
        user.experience = userExperience;
        const savedUser = await user.save();
        if (process.env.BLOCKCHAIN === BC_STATUS.ENABLED) {
            const bcUserDto = new BcUserDto();
            bcUserDto.loggedInUserId = req['user']._id;
            bcUserDto.company = req['user'].company.find((defaultCompany) => defaultCompany.default);
            await this.userBcService.storeUserBc(savedUser, bcUserDto, BC_PAYLOAD.REMOVE_EXPERIENCE);
        }
        if (!savedUser) throw new BadRequestException(USER_CONSTANT.FAILED_TO_REMOVE_EXPERIENCE);
        return await this.findUserWithPopulatedFields(savedUser._id, 'experience');
    }

    async findUserWithPopulatedFields(_id: string, populateField: string): Promise<IUser> {
        const user = await this.UserModel.findById({ _id }).select(populateField).populate(populateField);
        if (!user) {
            throw new NotFoundException(USER_CONSTANT.USER_NOT_FOUND);
        }
        return user;
    }

    async clearPasswordWrongBlock(email: string, resetBlockToken: string) {
        if (resetBlockToken === process.env.RESET_WRONG_PASSWORD_BLOCK_TOKEN) {
            const user = await this.UserModel.findOne({ email });
            if (user) {
                user.blockExpires = new Date();
                await this.passwordsAreMatch(user);
                return true;
            }
            throw new NotFoundException(USER_CONSTANT.USER_NOT_FOUND);
        }
        throw new ForbiddenException(USER_CONSTANT.RESET_PASSWORD_WRONG_BLOCK_FAILED);
    }

    async rejectUser(rejectUserDto: RejectUserDto, req: Request): Promise<void> {
        const loggedInUser: IUser = req['user'];
        let rejectedOrganization: Organization;
        try {
            const rejectedUser = await this.UserModel.findOneAndUpdate(
                {
                    _id: rejectUserDto.rejectedUser,
                    'company.isAdmin': true
                },
                {
                    $set: {
                        'company.$[].isRejected': true
                    }
                },
                { new: true }
            ).populate({ path: 'company.companyId', select: 'companyName' });
            rejectedOrganization = await this.organizationService.rejectOrganization(rejectedUser.company.find((companyRow) => companyRow.isAdmin).companyId as string);
            this.mailService.sendMail(rejectedUser.email, 'Your organization has been rejected.', 'Organization rejected', config.MAIL_TYPES.ORGANIZATION_REJECTED, {
                email: rejectedUser.email,
                organization: rejectedOrganization.companyName,
                description: rejectUserDto.description ?? '-'
            });
        } catch (err) {
            throw new BadRequestException(USER_CONSTANT.FAILED_TO_REJECT);
        }
        await this.userRejectInfoService.createUserRejectInformation({
            rejectedUser: rejectUserDto.rejectedUser,
            rejectedOrganization: rejectedOrganization.id,
            description: rejectUserDto.description,
            rejectedBy: loggedInUser.id
        });
    }

    async unblockUser(id: string) {
        try {
            const user = await this.UserModel.findById(id);
            user.loginAttempts = 0;
            user.blockExpires = new Date();
            await user.save();
        } catch (err) {
            throw new BadRequestException(USER_CONSTANT.FAILED_TO_UNBLOCK_USER, err);
        }
    }
}

import { SubscriptionTypeDto } from './dto/add-subscription.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterUserDto } from './dto/register-user.dto';
import { Roles, Permission, Feature } from 'src/components/auth/decorators';
import { Request, Response as ExpressResponse } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Put, Delete, UploadedFile, UseInterceptors, Param, BadRequestException, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AddCompanyDto } from './dto/add-company.dto';
import { SetDefaultCompanyDto } from './dto/set-default-company.dto';
import { CaseyResponse } from './interfaces/response.interface';
import { editFileName, imageFileFilter } from 'src/@core/utils/file-upload.utils';
import { NewUserDto } from './dto/new-user.dto';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Response } from 'src/@core/response';
import { USER_CONSTANT } from 'src/@core/constants/api-error-constants';
import { UserBcService } from './user-bc.service';
import { BC_SUCCESS_RESPONSE } from 'src/@core/constants/bc-constants/bc-success-response.constants';
import { AuthService } from 'src/components/auth/auth.service';
import { ResetBlockUserDto } from './dto/reset-block-user.dto';
import { BlockchainStatusGuard } from 'src/components/auth/guards/blockhainStatus.guard';
import { SubscriptionGuard } from 'src/components/auth/guards/subscription.guard';
import { BcUserDto } from 'src/@core/common/bc-user.dto';
import { RejectUserDto } from './dto/reject-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService, private readonly userBcService: UserBcService, private authService: AuthService) {}

    // used for both organization and user
    @Post('register')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register user' })
    @ApiCreatedResponse({})
    async registerNew(@Req() req: Request, @UploadedFile() file, @Body() registerUserDTO: RegisterUserDto) {
        return await this.userService.register(req, file?.filename, registerUserDTO);
    }

    @Put('update')
    @UseGuards(RolesGuard, PermissionGuard, SubscriptionGuard, BlockchainStatusGuard)
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.PERSONAL_DETAIL)
    @Roles(ROLE.SUPER_ADMIN, ROLE.OTHER, ROLE.STAFF)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'A private route for updating user detail' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Update user personal details' })
    @ApiCreatedResponse({})
    async updatePersonalDetails(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
        return await this.userService.updatePersonalDetails(updateUserDto, req);
    }

    @Put('extend-role')
    @UseGuards(RolesGuard, PermissionGuard, SubscriptionGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Add new role to extending user' })
    @ApiOkResponse({})
    async addNewRole(@Req() req: Request) {
        return await this.userService.addNewRole(req);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login User' })
    @ApiOkResponse({})
    async login(@Req() req: Request, @Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: ExpressResponse) {
        return await this.userService.login(req, loginUserDto, res);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout User' })
    @ApiResponse({ description: 'Success!', status: HttpStatus.OK })
    @ApiResponse({ description: 'Bad request.', status: HttpStatus.BAD_REQUEST })
    @ApiOkResponse({})
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: ExpressResponse) {
        return new Response(true, [USER_CONSTANT.LOGOUT_SUCCESS]).setStatus(HttpStatus.OK).setSuccessData({
            username: await this.userService.logoutUser(req, res)
        });
    }

    @Post('refresh-access-token')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Refresh Access Token with refresh token' })
    @ApiCreatedResponse({})
    async refreshAccessToken(@Body() refreshAccessTokenDto: RefreshAccessTokenDto, @Req() req: Request, @Res({ passthrough: true }) res: ExpressResponse) {
        return await this.userService.refreshAccessToken(refreshAccessTokenDto, req, res);
    }

    @Get('data')
    @UseGuards(RolesGuard, PermissionGuard, BlockchainStatusGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.PERSONAL_DETAIL)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'A private route for geting user detail' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    findUserProfile(@Req() req: Request) {
        return this.userService.findUserProfile(req);
    }

    @Get('user-activity')
    @UseGuards(RolesGuard, PermissionGuard, BlockchainStatusGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.USER_ACTIVITY)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'A private route for geting user detail' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    findOrganizationUserActivity(@Req() req: Request) {
        return this.userService.findOrganizationUserActivity(req);
    }

    @Get('user-count')
    @UseGuards(RolesGuard, BlockchainStatusGuard)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'A private route for geting user detail' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async findAllUserActivity() {
        const allCount = await this.userService.findAllUserCountData();
        return new Response(true, [USER_CONSTANT.LOGGEDIN_USER_DATA_COUNT_FETCHED]).setStatus(HttpStatus.OK).setSuccessData(allCount);
    }

    @Get('data/:id')
    @UseGuards(RolesGuard, BlockchainStatusGuard)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'A private route for geting user detail' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    findUserData(@Param('id') userId: string, @Req() req: Request) {
        return this.userService.findUserData(userId, req);
    }

    @Post('reject')
    @UseGuards(RolesGuard)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Reject User by super-admin' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({})
    async rejectUser(@Req() req: Request, @Body() rejectUserDto: RejectUserDto) {
        return new Response(true, [USER_CONSTANT.REJECTED_USER]).setStatus(HttpStatus.CREATED).setSuccessData(await this.userService.rejectUser(rejectUserDto, req));
    }

    @Put('data')
    @UseGuards(RolesGuard, PermissionGuard)
    @Permission(ACCESS_TYPE.DELETE)
    @Feature(FEATURE_IDENTIFIER.MANAGE_ALL_USER)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'A private route to disable user' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    disableUserCompany(@Body() verifyEmailDto: VerifyEmailDto) {
        return this.userService.disableUserCompany(verifyEmailDto);
    }

    @Get('all')
    @UseGuards(RolesGuard, PermissionGuard, SubscriptionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.MANAGE_ALL_USER)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'A admins private route to get all customer' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    findAllUser(@Req() req: Request) {
        return this.userService.findAllUser(req);
    }

    @Put('forget-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Forget Password' })
    @ApiOkResponse({})
    async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto, @Req() req: Request): Promise<CaseyResponse> {
        const { success, message } = await this.userService.forgetPassword(req, forgetPasswordDto);
        return {
            success,
            message
        };
    }

    @Put('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset Password when forget' })
    @ApiOkResponse({})
    async resetPassword(@Req() req: Request, @Body() resetPasswordDto: ResetPasswordDto): Promise<CaseyResponse> {
        try {
            const data = await this.userService.resetPassword(req, resetPasswordDto);
            return {
                success: true,
                message: 'Reset Password Successfull',
                data: data,
                error: null,
                errorMessage: ''
            };
        } catch (err) {
            return {
                success: false,
                message: err.message,
                data: null,
                error: err,
                errorMessage: err.message
            };
        }
    }

    @Put('change-password')
    @UseGuards(RolesGuard, BlockchainStatusGuard)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Change Password' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async changePassword(@Req() req: Request, @Body() changePasswordDto: ChangePasswordDto): Promise<CaseyResponse> {
        try {
            const data = await this.userService.changePassword(req, changePasswordDto);
            return {
                success: true,
                message: USER_CONSTANT.PASSWORD_CHANGED_SUCCESSFULLY,
                data: data,
                error: null,
                errorMessage: ''
            };
        } catch (err) {
            return {
                success: false,
                message: err.message,
                data: null,
                error: err,
                errorMessage: err.message
            };
        }
    }

    @Put('verify')
    @UseGuards(RolesGuard, PermissionGuard, BlockchainStatusGuard)
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.MANAGE_ALL_USER)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify user by admin' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async verifyUserByAdmin(@Body() verifyEmailDto: VerifyEmailDto, @Req() req: Request): Promise<CaseyResponse> {
        try {
            return await this.userService.verifyEmailByAdmin(verifyEmailDto, req);
        } catch (err) {
            return {
                success: false,
                message: 'Verification failed',
                error: err,
                errorMessage: err.message
            };
        }
    }

    @Put('add-subscription')
    @UseGuards(RolesGuard, PermissionGuard, BlockchainStatusGuard)
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.MANAGE_ALL_USER)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify user by admin' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async addSubscriptionType(@Body() subscriptionTypeDto: SubscriptionTypeDto, @Req() req: Request) {
        return new Response(true, [USER_CONSTANT.SUBSCRIPTION_UPDATED]).setSuccessData(await this.userService.addSubscriptionType(subscriptionTypeDto, req)).setStatus(HttpStatus.OK);
    }

    @Put('add-company')
    @UseGuards(RolesGuard, PermissionGuard, SubscriptionGuard, BlockchainStatusGuard)
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_USER)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Add required company when added from manage-user to existing companies'
    })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async addCompany(@Body() addCompanyDto: AddCompanyDto, @Req() req: Request) {
        return new Response(true, [USER_CONSTANT.NEW_COMPANY_ADDED]).setSuccessData(await this.userService.addCompanyToUser(addCompanyDto, req)).setStatus(HttpStatus.OK);
    }

    @Put('user-accept/:token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Set user Accept' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async verifyUseraccept(@Param('token') token: string) {
        return new Response(true, [USER_CONSTANT.NEW_COMPANY_ADDED]).setSuccessData(await this.userService.verifyUseraccept(token)).setStatus(HttpStatus.OK);
    }

    @Get('subscriptionType')
    @UseGuards(RolesGuard, PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'A admins private route to get all users by Subscription Type'
    })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async getRecordsBySubscriptionType(@Req() req: Request) {
        try {
            const data = await this.userService.getRecordsBySubscriptionType(req);
            return { success: true, data };
        } catch (err) {
            return { success: false, err };
        }
    }

    @Post('create/:subscription')
    @UseGuards(RolesGuard, PermissionGuard, SubscriptionGuard, BlockchainStatusGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_USER)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create user of organization' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({})
    async createUser(@Param('subscription') subscription: string, @Req() req: Request, @Body() newUserDto: NewUserDto) {
        return await this.userService.createUserForOrganization(newUserDto, req, subscription);
    }

    @Get('organization-user/all')
    @UseGuards(RolesGuard, PermissionGuard, SubscriptionGuard, BlockchainStatusGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_USER, FEATURE_IDENTIFIER.EMAIL_RECIPIENT)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get users of organization' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async getAllUserOfOrganization(@Req() req: Request) {
        return await this.userService.findAllUserOfOrganization(req);
    }

    @Put('organization-user/verify')
    @UseGuards(RolesGuard, PermissionGuard, SubscriptionGuard, BlockchainStatusGuard)
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_USER)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify user by admin of organization' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async verifyOrganizationUserByAdmin(@Body() verifyEmailDto: VerifyEmailDto, @Req() req: Request): Promise<CaseyResponse> {
        return await this.userService.verifyUserByOrganizationAdmin(verifyEmailDto, req);
    }

    @Put('organization-user/enable')
    @UseGuards(RolesGuard, PermissionGuard, SubscriptionGuard)
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_USER)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Enable user by admin of organization' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async enableOrganizationUserByAdmin(@Body() verifyEmailDto: VerifyEmailDto, @Req() req: Request): Promise<CaseyResponse> {
        try {
            return await this.userService.enableUserByOrganizationAdmin(verifyEmailDto, req);
        } catch (err) {
            throw new BadRequestException(USER_CONSTANT.FAILED_TO_ENABLE_USER, err);
        }
    }

    @Delete('organization-user/:userId')
    @UseGuards(RolesGuard, PermissionGuard, SubscriptionGuard)
    @Permission(ACCESS_TYPE.DELETE)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_USER)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Deleted user by admin of organization' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async deleteOrganizationUserByAdmin(@Param('userId') userId: string, @Req() req: Request) {
        return await this.userService.deleteUserByOrganizationAdmin(userId, req);
    }

    @Delete('organization-user/:staffingId/:userId')
    @UseGuards(RolesGuard, PermissionGuard)
    @Permission(ACCESS_TYPE.DELETE)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_USER)
    @Roles(ROLE.OTHER, ROLE.SUPER_ADMIN, ROLE.STAFF)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Deleted training user by admin of organization' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async deleteTrainingUserByAdmin(@Param('userId') userId: string, @Param('staffingId') staffingId: string, @Req() req: Request) {
        this.authService.additionalTrainingGuardForCommonApi(req, staffingId, ACCESS_TYPE.DELETE);
        return await this.userService.deleteUserByOrganizationAdmin(userId, req, staffingId);
    }

    @Put('organization-user/:userId')
    @UseGuards(RolesGuard, PermissionGuard, SubscriptionGuard, BlockchainStatusGuard)
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_USER)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Edit user by admin of organization' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async updateOrganizationUserByAdmin(@Body() updateUserDto: NewUserDto, @Param('userId') userId: string, @Req() req: Request) {
        return await this.userService.updateUserByOrganizationAdmin(updateUserDto, userId, req);
    }

    @Put('organization-user')
    @UseGuards(RolesGuard, PermissionGuard, SubscriptionGuard, BlockchainStatusGuard)
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_USER)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Disable User By Organization Admin from Manage-Users in header'
    })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async disableOrganizationUserByAdmin(@Body() disableUserDto: VerifyEmailDto, @Req() req: Request) {
        return await this.userService.disableUserByOrganizationAdmin(disableUserDto, req);
    }

    @Get('email')
    @UseGuards(RolesGuard)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find user Id by email' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async findUserByEmail(@Req() req: Request) {
        const email = <string>req.query.email;
        const decodedUri = decodeURIComponent(email);
        if (email) {
            return this.userService.buildRegistrationInfo(await this.userService.findByEmail(decodedUri));
        }
        return false;
    }

    @Put('change-default')
    @UseGuards(RolesGuard, PermissionGuard)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update Default Organization' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async changeDefaultCompany(@Body() updateUserDto: SetDefaultCompanyDto, @Req() req: Request, @Res({ passthrough: true }) res: ExpressResponse) {
        return new Response(true, [USER_CONSTANT.USER_DETAIL_FOUND]).setSuccessData(await this.userService.setDefaultCompany(updateUserDto, req, res)).setStatus(HttpStatus.OK);
    }

    @Post('registerBcIdentity')
    @UseGuards(RolesGuard, PermissionGuard, BlockchainStatusGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register user to blockchain' })
    @ApiCreatedResponse({})
    async registerBcAdmin(@Body() enrollDto: BcUserDto) {
        return new Response(true, [BC_SUCCESS_RESPONSE.USER_ENROLL_SUCCESS]).setSuccessData(await this.userBcService.registerUser(enrollDto, '', '')).setStatus(HttpStatus.OK);
    }

    @Post('block/reset')
    @HttpCode(HttpStatus.CREATED)
    @ApiHeader({
        name: 'reset-block-token',
        description: 'the token we need for auth.'
    })
    @ApiOperation({ summary: 'Reset block' })
    @ApiCreatedResponse({})
    async resetBlockUser(@Body() resetBlockUserDto: ResetBlockUserDto, @Req() req: Request) {
        const resetBlockToken = req.headers['reset-block-token'] as string;
        return new Response(true, [USER_CONSTANT.SUCCESSFULLY_CLEARED_PASSWORD_WRONG_BLOCK]).setSuccessData(await this.userService.clearPasswordWrongBlock(resetBlockUserDto.email, resetBlockToken)).setStatus(HttpStatus.CREATED);
    }

    @Put('unblock-user/:id')
    @UseGuards(RolesGuard, BlockchainStatusGuard)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Unblock User' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async unblockUser(@Param('id') id: string): Promise<Response> {
        return new Response(true, [USER_CONSTANT.USER_UNBLOCKED_SUCCESSFULLY]).setSuccessData(await this.userService.unblockUser(id));
    }
}

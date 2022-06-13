import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiExtraModels, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ROLE } from 'src/@core/constants';
import { USER_CONSTANT } from 'src/@core/constants/api-error-constants';
import { Roles } from 'src/components/auth/decorators';
import { UpdateUserRejectInformationDto } from './dto/update-user-reject-information.dto';
import { UserRejectInformationResponseDto } from './dto/user-reject-info.dto';
import { UserRejectInfoService } from './user-reject-info.service';
import { AppResponseDto, PaginatedDto } from 'src/@core/response/dto';
import { PaginateResult } from 'mongoose';
import { ApiOkAppResponseWithModel, ApiOkAppResponseWithPagination } from 'src/@core/response/decorators/api-response.decorator';

@Controller('rejected-informations')
@ApiTags('Api for Rejection Information')
@ApiExtraModels(AppResponseDto, PaginatedDto, UserRejectInformationResponseDto)
export class UserRejectInfoController {
    constructor(private userRejectInfoService: UserRejectInfoService) {}

    @Get('find/:userId')
    @UseGuards(AuthGuard('jwt'))
    @Roles(ROLE.SUPER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get User rejected Information' })
    @ApiOkAppResponseWithPagination(UserRejectInformationResponseDto)
    @ApiOkAppResponseWithModel(UserRejectInformationResponseDto, true)
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async getRejectInformationOfUser(@Req() req: Request, @Param('userId') rejectedUserId: string): Promise<AppResponseDto<PaginateResult<UserRejectInformationResponseDto> | UserRejectInformationResponseDto[]>> {
        const rejectionDetail = await this.userRejectInfoService.getUserRejectionDetail(rejectedUserId, req);
        return new AppResponseDto<PaginateResult<UserRejectInformationResponseDto> | UserRejectInformationResponseDto[]>(true, [USER_CONSTANT.SUCCESSFULLY_FETCHED_REJECTION_INFORMATION_OF_USER]).setSuccessData(rejectionDetail).setStatus(HttpStatus.OK);
    }

    @Put(':rejectInfoId')
    @UseGuards(AuthGuard('jwt'))
    @Roles(ROLE.SUPER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update User rejected Information' })
    @ApiOkAppResponseWithModel(UserRejectInformationResponseDto)
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async updateRejectInformationOfUser(@Param('rejectInfoId') rejectedInfoId: string, @Body() updateRejectUserInformationDto: UpdateUserRejectInformationDto): Promise<AppResponseDto<UserRejectInformationResponseDto>> {
        const updatedRejection = await this.userRejectInfoService.updateUserRejectInformation(rejectedInfoId, updateRejectUserInformationDto);
        return new AppResponseDto<UserRejectInformationResponseDto>(true, [USER_CONSTANT.SUCCESSFULLY_UPDATED_REJECTION_INFORMATION_OF_USER]).setSuccessData(updatedRejection).setStatus(HttpStatus.OK);
    }
}

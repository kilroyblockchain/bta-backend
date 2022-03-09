import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Response } from 'src/@core/response';
import { ROLE } from 'src/@core/constants';
import { USER_CONSTANT } from 'src/@core/constants/api-error-constants';
import { Roles } from 'src/components/auth/decorators';
import { UpdateUserRejectInformationDto } from './dto/update-user-reject-information.dto';
import { UserRejectInformationResponseDto } from './dto/user-reject-info.dto';
import { UserRejectInfoService } from './user-reject-info.service';

@Controller('rejected-informations')
@ApiTags('Api for Rejection Information')
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
    @ApiOperation({ summary: 'Get User rejected Informations' })
    @ApiOkResponse({ type: UserRejectInformationResponseDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async getRejectInformationsOfUser(@Req() req: Request, @Param('userId') rejectedUserId: string) {
        return new Response(true, [USER_CONSTANT.SUCCESSFULLY_FETCHED_REJECTION_INFORMATION_OF_USER]).setSuccessData(await this.userRejectInfoService.getUserRejectionDetail(rejectedUserId, req)).setStatus(HttpStatus.OK);
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
    @ApiOperation({ summary: 'Update User rejected Informations' })
    @ApiOkResponse({ type: UserRejectInformationResponseDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async updateRejectInformationsOfUser(@Param('rejectInfoId') rejectedInfoId: string, @Body() updateRejectUserInformationDto: UpdateUserRejectInformationDto) {
        return new Response(true, [USER_CONSTANT.SUCCESSFULLY_UPDATED_REJECTION_INFORMATION_OF_USER]).setSuccessData(await this.userRejectInfoService.updateUserRejectInformation(rejectedInfoId, updateRejectUserInformationDto)).setStatus(HttpStatus.OK);
    }
}

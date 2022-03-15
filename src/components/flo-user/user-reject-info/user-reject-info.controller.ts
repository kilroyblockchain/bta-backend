import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ROLE } from 'src/@core/constants';
import { USER_CONSTANT } from 'src/@core/constants/api-error-constants';
import { Roles } from 'src/components/auth/decorators';
import { UpdateUserRejectInformationDto } from './dto/update-user-reject-information.dto';
import { UserRejectInformationResponseDto } from './dto/user-reject-info.dto';
import { UserRejectInfoService } from './user-reject-info.service';
import { Response as FLOResponse } from 'src/@core/response';

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
    @ApiOperation({ summary: 'Get User rejected Information' })
    @ApiOkResponse({ type: UserRejectInformationResponseDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async getRejectInformationOfUser(@Req() req: Request, @Param('userId') rejectedUserId: string): Promise<FLOResponse> {
        const rejectionDetail = await this.userRejectInfoService.getUserRejectionDetail(rejectedUserId, req);
        return new FLOResponse(true, [USER_CONSTANT.SUCCESSFULLY_FETCHED_REJECTION_INFORMATION_OF_USER]).setSuccessData(rejectionDetail).setStatus(HttpStatus.OK);
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
    @ApiOkResponse({ type: UserRejectInformationResponseDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async updateRejectInformationOfUser(@Param('rejectInfoId') rejectedInfoId: string, @Body() updateRejectUserInformationDto: UpdateUserRejectInformationDto): Promise<FLOResponse> {
        const updatedRejection = await this.userRejectInfoService.updateUserRejectInformation(rejectedInfoId, updateRejectUserInformationDto);
        return new FLOResponse(true, [USER_CONSTANT.SUCCESSFULLY_UPDATED_REJECTION_INFORMATION_OF_USER]).setSuccessData(updatedRejection).setStatus(HttpStatus.OK);
    }
}

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CHANNEL_DETAIL } from 'src/@core/constants/bc-constants/channel-detail.constant';
import { Permission } from 'src/components/auth/decorators/permission.decorator';
import { Roles } from 'src/components/auth/decorators/roles.decorator';
import { ChannelDetailDto } from './dto/channel-detail.dto';
import { Response } from 'src/@core/response';
import { ChannelDetailService } from './channel-detail.service';
import { ACCESS_TYPE, ROLE } from 'src/@core/constants';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';

@Controller('channel-detail')
@ApiTags('Channel Detail api')
@UseGuards(RolesGuard)
export class ChannelDetailController {
    constructor(private readonly channelDetailService: ChannelDetailService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Store Channel details' })
    @ApiOkResponse({ type: ChannelDetailDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    @Permission(ACCESS_TYPE.WRITE)
    @Roles(ROLE.SUPER_ADMIN)
    async addChannelDetails(@Body() channelDetailDto: ChannelDetailDto) {
        return new Response(true, [CHANNEL_DETAIL.SUCCESSFULLY_ADDED_CHANNEL_DETAIL]).setSuccessData(await this.channelDetailService.addChannelDetail(channelDetailDto)).setStatus(HttpStatus.OK);
    }

    @Put('/:channelDetailId')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update Channel details' })
    @ApiOkResponse({ type: ChannelDetailDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    @Permission(ACCESS_TYPE.WRITE)
    @Roles(ROLE.SUPER_ADMIN)
    async updateChannelDetails(@Param('channelDetailId') channelDetailId: string, @Body() channelDetailDto: ChannelDetailDto) {
        return new Response(true, [CHANNEL_DETAIL.SUCCESSFULLY_UPDATED_CHANNEL_DETAIL]).setSuccessData(await this.channelDetailService.updateChannelDetail(channelDetailId, channelDetailDto)).setStatus(HttpStatus.OK);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Fetch All Channel Detail' })
    @ApiOkResponse({ type: ChannelDetailDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    @Permission(ACCESS_TYPE.READ)
    @Roles(ROLE.SUPER_ADMIN)
    async getAllChannelDetails(@Req() req: Request) {
        return new Response(true, [CHANNEL_DETAIL.FETCHED_ALL_CHANNEL_DETAIL]).setSuccessData(await this.channelDetailService.getAllChannelDetail(req)).setStatus(HttpStatus.OK);
    }

    @Get('/id/:channelDetailId')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Fetch Channel Detail by Id' })
    @ApiOkResponse({ type: ChannelDetailDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    @Permission(ACCESS_TYPE.READ)
    @Roles(ROLE.SUPER_ADMIN)
    async getChannelDetailById(@Param('channelDetailId') channelDetailId: string) {
        return new Response(true, [CHANNEL_DETAIL.FETCHED_CHANNEL_DETAIL]).setSuccessData(await this.channelDetailService.getChannelDetailById(channelDetailId)).setStatus(HttpStatus.OK);
    }

    @Get('/status/:status')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Fetch All Channel Detail By Status | true or false'
    })
    @ApiOkResponse({ type: ChannelDetailDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    @Permission(ACCESS_TYPE.READ)
    @Roles(ROLE.SUPER_ADMIN)
    async getAllEnabledChannelDetails(@Req() req: Request, @Param('status') status: boolean) {
        return new Response(true, [CHANNEL_DETAIL.FETCHED_ALL_CHANNEL_DETAIL]).setSuccessData(await this.channelDetailService.getAllChannelDetailByStatus(req, status)).setStatus(HttpStatus.OK);
    }

    @Delete('/:channelDetailId')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete Channel Detail' })
    @ApiOkResponse({ type: ChannelDetailDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    @Permission(ACCESS_TYPE.READ)
    @Roles(ROLE.SUPER_ADMIN)
    async deleteChannelDetail(@Param('channelDetailId') channelDetailId: string) {
        return new Response(true, [CHANNEL_DETAIL.SUCCESSFULLY_DELETED_CHANNEL_DETAIL]).setSuccessData(await this.channelDetailService.deleteChannelDetail(channelDetailId)).setStatus(HttpStatus.OK);
    }

    @Get('/default')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Fetch Default Channel Detail' })
    @ApiOkResponse({ type: ChannelDetailDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    @Permission(ACCESS_TYPE.READ)
    @Roles(ROLE.SUPER_ADMIN)
    async getDefaultChannelDetail() {
        return new Response(true, [CHANNEL_DETAIL.FETCHED_DEFAULT_CHANNEL_DETAIL]).setSuccessData(await this.channelDetailService.getDefaultChannelDetail()).setStatus(HttpStatus.OK);
    }

    @Get('/non-default')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Fetch Non Default Channel Detail' })
    @ApiOkResponse({ type: ChannelDetailDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    @Permission(ACCESS_TYPE.READ)
    @Roles(ROLE.SUPER_ADMIN)
    async getAllNonDefaultChannelDetail() {
        return new Response(true, [CHANNEL_DETAIL.FETCHED_ALL_NON_DEFAULT_CHANNEL_DETAILS]).setSuccessData(await this.channelDetailService.getAllNonDefaultChannelDetails()).setStatus(HttpStatus.OK);
    }
}

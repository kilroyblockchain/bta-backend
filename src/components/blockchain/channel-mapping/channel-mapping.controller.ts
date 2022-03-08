import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/components/auth/decorators';
import { Response } from 'src/@core/response';
import { ACCESS_TYPE } from 'src/@core/constants';
import { ChannelMappingService } from './channel-mapping.service';
import { ChannelMappingDto } from './dto/channel-mapping.dto';
import { CHANNEL_MAPPING } from 'src/@core/constants/bc-constants/channel-mapping.constant';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { Request } from 'express';
import { COMMON_ERROR } from 'src/@core/constants/api-error-constants';

@Controller('channel-mapping')
@ApiTags('Channel Mapping api')
@UseGuards(RolesGuard)
export class ChannelMappingController {
    constructor(private readonly channelMappingService: ChannelMappingService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add Channel Mapping' })
    @ApiOkResponse({ type: ChannelMappingDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    @Permission(ACCESS_TYPE.WRITE)
    async addChannelMapping(@Body() channelMappingDto: ChannelMappingDto) {
        return new Response(true, [CHANNEL_MAPPING.SUCCESSFULLY_ADDED_CHANNEL_MAPPING]).setSuccessData(await this.channelMappingService.addChannelMapping(channelMappingDto)).setStatus(HttpStatus.OK);
    }

    @Get('/:userId/:organizationId')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get Channel Mapping By User Id and Organization Id'
    })
    @ApiOkResponse({ type: ChannelMappingDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    @Permission(ACCESS_TYPE.READ)
    async getChannelMappingByUserAndOrganization(@Param('userId') userId: string, @Param('organizationId') organizationId: string) {
        return new Response(true, [CHANNEL_MAPPING.FETCHED_CHANNEL_MAPPING]).setSuccessData(await this.channelMappingService.getChannelMappingByUserAndOrganization(userId, organizationId)).setStatus(HttpStatus.OK);
    }

    @Post('super-admin')
    @HttpCode(HttpStatus.CREATED)
    @ApiHeader({
        name: 'super-admin',
        description: 'the channel mapping data for superadmin.'
    })
    @ApiOperation({ summary: 'Super admin channel mapping' })
    @ApiCreatedResponse({})
    async superAdminChannelMapping(@Body() channelMappingDto: ChannelMappingDto, @Req() req: Request) {
        const channelMappingToken = req.headers['channel-mapping-token'] as string;
        if (channelMappingToken !== process.env.RESET_WRONG_PASSWORD_BLOCK_TOKEN) {
            throw new ForbiddenException(COMMON_ERROR.UNAUTHORIZED_TO_ACCESS);
        }
        return new Response(true, [CHANNEL_MAPPING.SUCCESSFULLY_ADDED_SUPER_ADMIN_CHANNEL_MAPPING]).setSuccessData(await this.channelMappingService.addChannelMapping(channelMappingDto)).setStatus(HttpStatus.CREATED);
    }
}

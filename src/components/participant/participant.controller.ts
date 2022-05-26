import { Roles, Permission, Feature } from 'src/components/auth/decorators';
import { Controller, UseGuards, HttpCode, HttpStatus, Post, Body, Get, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Response as FLOResponse } from 'src/@core/response';
import { Request } from 'express';
import { ParticipantService } from './participant.service';
import { ParticipantAddDto } from './dto/participant-add.dto';
import { PARTICIPANT_CONSTANT } from 'src/@core/constants/api-error-constants/participant.constant';

@ApiTags('Participant')
@Controller('participant')
export class ParticipantController {
    constructor(private readonly participantService: ParticipantService) {}

    @Post('create')
    @UseGuards(RolesGuard, PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.PROJECT)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'A admins private route to create participant' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async createParticipant(@Body() participantAddDto: ParticipantAddDto): Promise<FLOResponse> {
        return new FLOResponse(true, [PARTICIPANT_CONSTANT.PARTICIPANT_ADDED]).setSuccessData(await this.participantService.createParticipant(participantAddDto)).setStatus(HttpStatus.OK);
    }

    @Get('all')
    @UseGuards(RolesGuard, PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.PROJECT)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'A admins private route to get all participants' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async findAllParticipant(@Req() req: Request): Promise<FLOResponse> {
        return new FLOResponse(true, [PARTICIPANT_CONSTANT.PARTICIPANT_LIST_FETCHED]).setSuccessData(await this.participantService.getAllParticipant(req)).setStatus(HttpStatus.OK);
    }
}

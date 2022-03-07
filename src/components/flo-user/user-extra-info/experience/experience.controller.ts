import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/@core/response';
import { ExperienceDto } from './dto/experience.dto';
import { ExperienceService } from './experience.service';
import { EXPERIENCE_CONSTANT } from 'src/@core/constants/api-error-constants';
import { Request } from 'express';

@ApiTags('Experience')
@Controller('experience')
export class ExperienceController {
    constructor(private readonly experienceService: ExperienceService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Store Experience record' })
    @ApiOkResponse({ type: ExperienceDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async createExperience(@Req() req: Request, @Body() createExperienceDto: ExperienceDto) {
        return new Response(true, [EXPERIENCE_CONSTANT.SUCCESSFULLY_CREATED_EXPERIENCE]).setSuccessData(await this.experienceService.createExperience(createExperienceDto, req)).setStatus(HttpStatus.CREATED);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find All Experiences' })
    @ApiOkResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async getAllExperience(@Req() req: Request) {
        return new Response(true, [EXPERIENCE_CONSTANT.SUCCESSFULLY_FETCHED_EXPERIENCE]).setSuccessData(await this.experienceService.findAllExperience(req)).setStatus(HttpStatus.OK);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find Experience By Id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Experience doesnot exists'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async findExperienceById(@Param('id') id: string) {
        return new Response(true, [EXPERIENCE_CONSTANT.SUCCESSFULLY_FETCHED_EXPERIENCE]).setSuccessData(await this.experienceService.findExperienceById(id)).setStatus(HttpStatus.OK);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update Experience By Id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Experience doesnot exists'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async updateExperience(@Param('id') id: string, @Body() updateExperienceDto: ExperienceDto, @Req() req: Request) {
        return new Response(true, [EXPERIENCE_CONSTANT.SUCCESSFULLY_UPDATED_EXPERIENCE]).setSuccessData(await this.experienceService.updateExperience(id, updateExperienceDto, req)).setStatus(HttpStatus.OK);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete Experience' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Experience doesnot exists'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async deleteExperience(@Param('id') id: string, @Req() req: Request) {
        return new Response(true, [EXPERIENCE_CONSTANT.EXPERIENCE_DELETED]).setSuccessData(await this.experienceService.deleteExperience(id, req)).setStatus(HttpStatus.OK);
    }

    @Get('blockchain-history/:experienceId')
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get Blockchain History Experience' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Experience doesnot exists'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async getBlockchainHistory(@Req() req: Request, @Param('experienceId') experienceId: string): Promise<Response> {
        return new Response(true, [EXPERIENCE_CONSTANT.SUCCESSFULLY_FETCHED_EXPERIENCE]).setSuccessData(await this.experienceService.findExperienceBlockchainHistory(req, experienceId));
    }
}

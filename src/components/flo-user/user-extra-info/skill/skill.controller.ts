import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Response } from 'src/@core/response';
import { FEATURE_IDENTIFIER } from 'src/@core/constants';
import { SKILL_CONSTANT } from 'src/@core/constants/api-error-constants';
import { BC_SUCCESS_RESPONSE } from 'src/@core/constants/bc-constants/bc-success-response.constants';
import { Feature } from 'src/components/auth/decorators/feature.decorator';
import { BlockchainStatusGuard } from 'src/components/auth/guards/blockhainStatus.guard';
import { SkillDto } from './dto/skill.dto';
import { SkillService } from './skill.service';

@ApiTags('Skill')
@Controller('skill')
export class SkillController {
    constructor(private readonly skillService: SkillService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Store Skill record' })
    @ApiOkResponse({ type: SkillDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async createSkill(@Req() req: Request, @Body() createSkillDto: SkillDto) {
        return new Response(true, [SKILL_CONSTANT.SUCCESSFULLY_CREATED_SKILL]).setSuccessData(await this.skillService.createSkill(createSkillDto, req)).setStatus(HttpStatus.CREATED);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find All Skills' })
    @ApiOkResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async getAllSkill(@Req() req: Request) {
        return new Response(true, [SKILL_CONSTANT.SUCCESSFULLY_FETCHED_SKILL]).setSuccessData(await this.skillService.findAllSkill(req)).setStatus(HttpStatus.OK);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find Skill By Id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Skill doesnot exists'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async findSkillById(@Param('id') id: string) {
        return new Response(true, [SKILL_CONSTANT.SUCCESSFULLY_FETCHED_SKILL]).setSuccessData(await this.skillService.findSkillById(id)).setStatus(HttpStatus.OK);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update Skill By Id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Skill doesnot exists'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async updateSkill(@Param('id') id: string, @Body() updateSkillDto: SkillDto, @Req() req: Request) {
        return new Response(true, [SKILL_CONSTANT.SUCCESSFULLY_UPDATED_SKILL]).setSuccessData(await this.skillService.updateSkill(id, updateSkillDto, req)).setStatus(HttpStatus.OK);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete Skill' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Skill doesnot exists'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async deleteSkill(@Param('id') id: string, @Req() req: Request) {
        return new Response(true, [SKILL_CONSTANT.SKILL_DELETED]).setSuccessData(await this.skillService.deleteSkill(id, req)).setStatus(HttpStatus.OK);
    }

    @Get('blockchain-history/:skillId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), BlockchainStatusGuard)
    @Feature(FEATURE_IDENTIFIER.BLOCKCHAIN_HISTORY)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Get BlockchainHistory of given skill' })
    @ApiOkResponse({
        description: 'Skill Blockchain history retireved successfully.',
        type: Response
    })
    async getBlockchainHistory(@Req() req: Request, @Param('skillId') skillId: string): Promise<Response> {
        return new Response(true, [BC_SUCCESS_RESPONSE.BLOCKCHAIN_HISTORY_FOUND]).setSuccessData(await this.skillService.findSkillBlockchainHistory(req, skillId));
    }
}

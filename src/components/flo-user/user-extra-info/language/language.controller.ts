import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Response } from 'src/@core/response';
import { FEATURE_IDENTIFIER } from 'src/@core/constants';
import { LANGUAGE_CONSTANT } from 'src/@core/constants/api-error-constants';
import { BC_SUCCESS_RESPONSE } from 'src/@core/constants/bc-constants/bc-success-response.constants';
import { Feature } from 'src/components/auth/decorators/feature.decorator';
import { BlockchainStatusGuard } from 'src/components/auth/guards/blockhainStatus.guard';
import { LanguageDto } from './dto/language.dto';
import { LanguageService } from './language.service';

@ApiTags('Language')
@Controller('language')
export class LanguageController {
    constructor(private readonly languageService: LanguageService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Store Language record' })
    @ApiOkResponse({ type: LanguageDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async createLanguage(@Req() req: Request, @Body() createLanguageDto: LanguageDto) {
        return new Response(true, [LANGUAGE_CONSTANT.SUCCESSFULLY_CREATED_LANGUAGE]).setSuccessData(await this.languageService.createLanguage(createLanguageDto, req)).setStatus(HttpStatus.CREATED);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find All Languages' })
    @ApiOkResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async getAllLanguage(@Req() req: Request) {
        return new Response(true, [LANGUAGE_CONSTANT.SUCCESSFULLY_FETCHED_LANGUAGE]).setSuccessData(await this.languageService.findAllLanguage(req)).setStatus(HttpStatus.OK);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find Language By Id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Language doesnot exists'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async findLanguageById(@Param('id') id: string) {
        return new Response(true, [LANGUAGE_CONSTANT.SUCCESSFULLY_FETCHED_LANGUAGE]).setSuccessData(await this.languageService.findLanguageById(id)).setStatus(HttpStatus.OK);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update Language By Id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Language doesnot exists'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async updateLanguage(@Param('id') id: string, @Body() updateLanguageDto: LanguageDto, @Req() req: Request) {
        return new Response(true, [LANGUAGE_CONSTANT.SUCCESSFULLY_UPDATED_LANGUAGE]).setSuccessData(await this.languageService.updateLanguage(id, updateLanguageDto, req)).setStatus(HttpStatus.OK);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete Language' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Language doesnot exists'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async deleteLanguage(@Param('id') id: string, @Req() req: Request) {
        return new Response(true, [LANGUAGE_CONSTANT.LANGUAGE_DELETED]).setSuccessData(await this.languageService.deleteLanguage(id, req)).setStatus(HttpStatus.OK);
    }

    @Get('blockchain-history/:languageId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), BlockchainStatusGuard)
    @Feature(FEATURE_IDENTIFIER.BLOCKCHAIN_HISTORY)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Get BlockchainHistory of given language' })
    @ApiOkResponse({
        description: 'Language Blockchain history retireved successfully.',
        type: Response
    })
    async getBlockchainHistory(@Req() req: Request, @Param('languageId') languageId: string): Promise<Response> {
        return new Response(true, [BC_SUCCESS_RESPONSE.BLOCKCHAIN_HISTORY_FOUND]).setSuccessData(await this.languageService.findLanguageBlockchainHistory(req, languageId));
    }
}

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EducationDto } from './dto/education.dto';
import { EducationService } from './education.service';
import { Response } from 'src/@core/response';
import { EDUCATION_CONSTANT } from 'src/@core/constants/api-error-constants';
import { ACCESS_TYPE, FEATURE_IDENTIFIER } from 'src/@core/constants';
import { Feature } from 'src/components/auth/decorators/feature.decorator';
import { BlockchainStatusGuard } from 'src/components/auth/guards/blockhainStatus.guard';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { Permission } from 'src/components/auth/decorators/permission.decorator';
import { BC_SUCCESS_RESPONSE } from 'src/@core/constants/bc-constants/bc-success-response.constants';

@ApiTags('Education')
@Controller('education')
export class EducationController {
    constructor(private readonly educationService: EducationService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Store Education record' })
    @ApiOkResponse({ type: EducationDto })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async createEducation(@Req() req: Request, @Body() createEducationDto: EducationDto) {
        return new Response(true, [EDUCATION_CONSTANT.SUCCESSFULLY_CREATED_EDUCATION]).setSuccessData(await this.educationService.createEducation(createEducationDto, req)).setStatus(HttpStatus.CREATED);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find All Educations' })
    @ApiOkResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async getAllEducation(@Req() req: Request) {
        return new Response(true, [EDUCATION_CONSTANT.SUCCESSFULLY_FETCHED_EDUCATION]).setSuccessData(await this.educationService.findAllEducation(req)).setStatus(HttpStatus.OK);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find Education By Id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Education doesnot exists'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async findEducationById(@Param('id') id: string) {
        return new Response(true, [EDUCATION_CONSTANT.SUCCESSFULLY_FETCHED_EDUCATION]).setSuccessData(await this.educationService.findEducationById(id)).setStatus(HttpStatus.OK);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update Education By Id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Education doesnot exists'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async updateEducation(@Param('id') id: string, @Body() updateEducationDto: EducationDto, @Req() req: Request) {
        return new Response(true, [EDUCATION_CONSTANT.SUCCESSFULLY_UPDATED_EDUCATION]).setSuccessData(await this.educationService.updateEducation(id, updateEducationDto, req)).setStatus(HttpStatus.OK);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete Education' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Education doesnot exists'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized.'
    })
    async deleteEducation(@Param('id') id: string, @Req() req: Request) {
        return new Response(true, [EDUCATION_CONSTANT.EDUCATION_DELETED]).setSuccessData(await this.educationService.deleteEducation(id, req)).setStatus(HttpStatus.OK);
    }

    @Get('blockchain-history/:educationId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, BlockchainStatusGuard)
    @Feature(FEATURE_IDENTIFIER.BLOCKCHAIN_HISTORY)
    @Permission(ACCESS_TYPE.READ)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Get BlockchainHistory of given education' })
    @ApiOkResponse({
        description: 'Education Blockchain history retireved successfully.',
        type: Response
    })
    async getBlockchainHistory(@Req() req: Request, @Param('educationId') educationId: string): Promise<Response> {
        return new Response(true, [BC_SUCCESS_RESPONSE.BLOCKCHAIN_HISTORY_FOUND]).setSuccessData(await this.educationService.findEducationBlockchainHistory(req, educationId));
    }
}

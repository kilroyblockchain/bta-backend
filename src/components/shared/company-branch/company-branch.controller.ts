import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyBranchDto } from 'src/components/shared/company-branch/dto/company-branch.dto';
import { CompanyBranchService } from 'src/components/shared/company-branch/company-branch.service';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { SubscriptionGuard } from 'src/components/auth/guards/subscription.guard';
import { Roles, Feature, Permission } from 'src/components/auth/decorators';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Response as FLOResponse } from 'src/@core/response';
import { BC_SUCCESS_RESPONSE } from 'src/@core/constants/bc-constants/bc-success-response.constants';
import { COMPANY_BRANCH_CONSTANT } from 'src/@core/constants/api-error-constants';

@ApiTags('CompanyBranch')
@Controller('company-branch')
export class CompanyBranchController {
    constructor(private readonly companyBranchService: CompanyBranchService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Roles(ROLE.STAFF)
    @HttpCode(HttpStatus.CREATED)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create CompanyBranch record' })
    @ApiOkResponse({ type: CompanyBranchDto })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    async createCompanyBranch(@Req() req: Request, @Body() createCompanyBranchDto: CompanyBranchDto) {
        return new FLOResponse(true, [COMPANY_BRANCH_CONSTANT.SUCCESSFULLY_CREATED_COMPANY_BRANCH]).setSuccessData(await this.companyBranchService.createCompanyBranch(createCompanyBranchDto, req)).setStatus(HttpStatus.CREATED);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Roles(ROLE.STAFF)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find All CompanyBranches' })
    @ApiOkResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    async getAllCompanyBranch(@Req() req: Request) {
        return new FLOResponse(true, [COMPANY_BRANCH_CONSTANT.SUCCESSFULLY_FETCHED_COMPANY_BRANCH]).setSuccessData(await this.companyBranchService.findAllCompanyBranch(req)).setStatus(HttpStatus.OK);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Roles(ROLE.STAFF)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find CompanyBranch By Id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'CompanyBranch does not exists' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    async findCompanyBranchById(@Param('id') id: string) {
        return new FLOResponse(true, [COMPANY_BRANCH_CONSTANT.SUCCESSFULLY_FETCHED_COMPANY_BRANCH]).setSuccessData(await this.companyBranchService.findCompanyBranchById(id)).setStatus(HttpStatus.OK);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Roles(ROLE.STAFF)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update CompanyBranch By Id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'CompanyBranch does not exists' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    async updateCompanyBranch(@Param('id') id: string, @Body() updateCompanyBranchDto: CompanyBranchDto, @Req() req: Request) {
        return new FLOResponse(true, [COMPANY_BRANCH_CONSTANT.SUCCESSFULLY_UPDATED_COMPANY_BRANCH]).setSuccessData(await this.companyBranchService.updateCompanyBranch(id, updateCompanyBranchDto, req)).setStatus(HttpStatus.OK);
    }

    @Put('disable/:id')
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Roles(ROLE.STAFF)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Disable CompanyBranch' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'CompanyBranch does not exists' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    async disableCompanyBranch(@Param('id') id: string, @Req() req: Request) {
        return new FLOResponse(true, [COMPANY_BRANCH_CONSTANT.COMPANY_BRANCH_DISABLED]).setSuccessData(await this.companyBranchService.disableCompanyBranch(id, req)).setStatus(HttpStatus.OK);
    }

    @Put('enable/:id')
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Roles(ROLE.STAFF)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Enable CompanyBranch' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'CompanyBranch does not exists' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    async enableCompanyBranch(@Param('id') id: string, @Req() req: Request) {
        return new FLOResponse(true, [COMPANY_BRANCH_CONSTANT.COMPANY_BRANCH_ENABLED]).setSuccessData(await this.companyBranchService.enableCompanyBranch(id, req)).setStatus(HttpStatus.OK);
    }

    @Get('blockchain-history/:companyBranchId')
    @UseGuards(AuthGuard('jwt'))
    @Roles(ROLE.STAFF)
    @Feature(FEATURE_IDENTIFIER.COMPANY_BRANCH_BLOCKCHAIN_HISTORY)
    @Permission(ACCESS_TYPE.READ)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get Blockchain History Company Branch' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success!' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Company Branch does not exists' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    async getBlockchainHistory(@Req() req: Request, @Param('companyBranchId') companyBranchId: string) {
        return new FLOResponse(true, [BC_SUCCESS_RESPONSE.BLOCKCHAIN_HISTORY_FOUND]).setSuccessData(await this.companyBranchService.getCompanyBranchBlockchainHistory(req, companyBranchId)).setStatus(HttpStatus.OK);
    }
}

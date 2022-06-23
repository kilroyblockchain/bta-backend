import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { OrganizationUnitService } from './organization-unit.service';
import { ApiBearerAuth, ApiTags, ApiHeader, ApiOperation, ApiExtraModels } from '@nestjs/swagger';
import { Controller, UseGuards, Post, HttpCode, HttpStatus, Body, Get, Param, Put, Delete, Req, BadRequestException, NotFoundException } from '@nestjs/common';
import { Roles, Feature, Permission } from 'src/components/auth/decorators';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { SubscriptionGuard } from 'src/components/auth/guards/subscription.guard';
import { ORGANIZATION_UNIT_CONSTANT } from 'src/@core/constants/api-error-constants';
import { OrganizationUnitResponse, CreateOrganizationUnitDto, DeletedOrganizationUnitResponse } from './dto';
import { AppResponseDto, PaginatedDto } from 'src/@core/response/dto';
import { ApiCreatedAppResponseWithModel, ApiOkAppResponseWithModel, ApiOkAppResponseWithPagination } from 'src/@core/response/decorators/api-response.decorator';

@ApiTags('Organization Unit')
@UseGuards(RolesGuard)
@Controller('organization-unit')
@ApiExtraModels(AppResponseDto, PaginatedDto, OrganizationUnitResponse)
export class OrganizationUnitController {
    constructor(private readonly organizationUnitService: OrganizationUnitService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_UNIT)
    @Permission(ACCESS_TYPE.WRITE)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Create New Organization Unit' })
    @ApiCreatedAppResponseWithModel(OrganizationUnitResponse)
    async createOrganizationUnit(@Body() newUnit: CreateOrganizationUnitDto): Promise<AppResponseDto<OrganizationUnitResponse>> {
        try {
            return new AppResponseDto<OrganizationUnitResponse>(true, [ORGANIZATION_UNIT_CONSTANT.NEW_ORGANIZATION_UNIT_CREATED]).setSuccessData(await this.organizationUnitService.createNewOrganizationUnit(newUnit)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(ORGANIZATION_UNIT_CONSTANT.UNABLE_TO_CREATE_ORGANIZATION_UNIT, err);
        }
    }

    @Get('company/:companyId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_UNIT)
    @Permission(ACCESS_TYPE.READ)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Get Organization Units By company Id with pagination meta data' })
    @ApiOkAppResponseWithPagination(OrganizationUnitResponse)
    async getUnitsByCompanyId(@Param('companyId') companyId: string, @Req() req: Request): Promise<AppResponseDto<PaginatedDto<OrganizationUnitResponse>>> {
        try {
            return new AppResponseDto<PaginatedDto<OrganizationUnitResponse>>(true, [ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_RETRIEVED]).setSuccessData(await this.organizationUnitService.getUnitsByCompanyId(companyId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(ORGANIZATION_UNIT_CONSTANT.UNABLE_TO_RETRIEVE_ORGANIZATION_UNIT, err);
        }
    }

    @Get('all/:defaultSubscriptionType')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_UNIT)
    @Permission(ACCESS_TYPE.READ)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Get All Organization Units' })
    @ApiOkAppResponseWithModel(OrganizationUnitResponse, true)
    async getAllOrganizationUnits(@Param('defaultSubscriptionType') defaultSubscriptionType: string, @Req() req: Request): Promise<AppResponseDto<OrganizationUnitResponse[]>> {
        try {
            return new AppResponseDto<OrganizationUnitResponse[]>(true, [ORGANIZATION_UNIT_CONSTANT.ALL_ORGANIZATION_UNIT_RETRIEVED]).setSuccessData(await this.organizationUnitService.getAllOrganizationUnits(req, defaultSubscriptionType)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNITS_NOT_FOUND, err);
        }
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_UNIT)
    @Permission(ACCESS_TYPE.READ)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Get Organization Unit By Id' })
    @ApiOkAppResponseWithModel(OrganizationUnitResponse)
    async getOrganizationUnitById(@Param('id') id: string): Promise<AppResponseDto<OrganizationUnitResponse>> {
        try {
            return new AppResponseDto<OrganizationUnitResponse>(true, [ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_RETRIEVED]).setSuccessData(await this.organizationUnitService.getOrganizationUnitById(id)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_NOT_FOUND, err);
        }
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_UNIT)
    @Permission(ACCESS_TYPE.UPDATE)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Update Organization Unit' })
    @ApiOkAppResponseWithModel(OrganizationUnitResponse)
    async updateOrganizationUnit(@Body() updateUnit: CreateOrganizationUnitDto, @Param('id') id: string): Promise<AppResponseDto<OrganizationUnitResponse>> {
        try {
            return new AppResponseDto<OrganizationUnitResponse>(true, [ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_UPDATED]).setSuccessData(await this.organizationUnitService.updateOrganizationUnit(id, updateUnit)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(ORGANIZATION_UNIT_CONSTANT.UNABLE_TO_UPDATE_ORGANIZATION_UNIT, err);
        }
    }

    @Put('enable-organization-unit/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_UNIT)
    @Permission(ACCESS_TYPE.UPDATE)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Enable Organization Unit' })
    @ApiOkAppResponseWithModel(OrganizationUnitResponse)
    async enableOrganizationUnit(@Param('id') unitId: string): Promise<AppResponseDto<OrganizationUnitResponse>> {
        const organizationUnit = await this.organizationUnitService.enableOrganizationUnit(unitId);
        return new AppResponseDto<OrganizationUnitResponse>(true, [ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_ENABLED]).setSuccessData(organizationUnit).setStatus(HttpStatus.OK);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_UNIT)
    @Permission(ACCESS_TYPE.DELETE)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Delete Organization Unit' })
    @ApiOkAppResponseWithModel(DeletedOrganizationUnitResponse)
    async deleteOrganizationUnit(@Param('id') id: string): Promise<AppResponseDto<OrganizationUnitResponse>> {
        try {
            return new AppResponseDto<OrganizationUnitResponse>(true, [ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_DELETED]).setSuccessData(await this.organizationUnitService.deleteOrganizationUnit(id)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(ORGANIZATION_UNIT_CONSTANT.CANNOT_DELETE_ORGANIZATION_UNIT, err);
        }
    }
}

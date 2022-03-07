import { Request } from 'express';
import { Response } from 'src/@core/response';
import { CreateOrganizationUnitDto } from './dto/createorganization-unit.dto';
import { AuthGuard } from '@nestjs/passport';
import { OrganizationUnitService } from './organization-unit.service';
import { ApiBearerAuth, ApiTags, ApiHeader, ApiOperation, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Controller, UseGuards, Post, HttpCode, HttpStatus, Body, Get, Param, Put, Delete, Req, BadRequestException, NotFoundException } from '@nestjs/common';
import { Roles } from 'src/components/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { Feature } from 'src/components/auth/decorators/feature.decorator';
import { Permission } from 'src/components/auth/decorators/permission.decorator';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { SubscriptionGuard } from 'src/components/auth/guards/subscription.guard';
import { ORGANIZATION_UNIT_CONSTANT } from 'src/@core/constants/api-error-constants';

@ApiTags('Organization Unit')
@UseGuards(RolesGuard)
@Controller('organization-unit')
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
    @ApiCreatedResponse({
        description: 'Organization Unit has been successfully added.'
    })
    async createOrganizationUnit(@Body() newUnit: CreateOrganizationUnitDto): Promise<Response> {
        try {
            return new Response(true, [ORGANIZATION_UNIT_CONSTANT.NEW_ORGANIZATION_UNIT_CREATED]).setSuccessData(await this.organizationUnitService.createNewOrganizationUnit(newUnit)).setStatus(HttpStatus.OK);
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
    @ApiOperation({ summary: 'Get Organization Units By company Id' })
    @ApiOkResponse({
        description: 'All Units Retireved Successfully.'
    })
    async getUnitsByCompanyId(@Param('companyId') companyId: string, @Req() req: Request): Promise<Response> {
        try {
            return new Response(true, [ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_RETRIEVED]).setSuccessData(await this.organizationUnitService.getUnitsByCompanyId(companyId, req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(ORGANIZATION_UNIT_CONSTANT.UNABLE_TO_RETRIEVE_ORGANIZATION_UNIT, err);
        }
    }

    @Get('training')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Get Training Organization Unit' })
    @ApiOkResponse({
        description: 'Training Unit fetched successfully.'
    })
    async getTrainingUnit(): Promise<Response> {
        return new Response(true, [ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_RETRIEVED]).setSuccessData(await this.organizationUnitService.getTrainingOrganizationUnits()).setStatus(HttpStatus.OK);
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
    @ApiOkResponse({
        description: 'All Units Retireved Successfully.'
    })
    async getAllOrganizationUnits(@Param('defaultSubscriptionType') defaultSubscriptionType: string, @Req() req: Request): Promise<Response> {
        try {
            return new Response(true, [ORGANIZATION_UNIT_CONSTANT.ALL_ORGANIZATION_UNIT_RETRIEVED]).setSuccessData(await this.organizationUnitService.getAllOrganizationUnits(req, defaultSubscriptionType)).setStatus(HttpStatus.OK);
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
    @ApiOkResponse({
        description: 'Organization Unit Found.'
    })
    async getOrganizationUnitById(@Param('id') id: string): Promise<Response> {
        try {
            return new Response(true, [ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_RETRIEVED]).setSuccessData(await this.organizationUnitService.getOrganizationUnitById(id)).setStatus(HttpStatus.OK);
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
    @ApiOkResponse({
        description: 'Organization Unit has been successfully updated.'
    })
    async updateOrganizationUnit(@Body() updateUnit: CreateOrganizationUnitDto, @Param('id') id: string): Promise<Response> {
        try {
            return new Response(true, [ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_UPDATED]).setSuccessData(await this.organizationUnitService.updateOrganizationUnit(id, updateUnit)).setStatus(HttpStatus.OK);
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
    @ApiOkResponse({
        description: 'Organization Unit Enabled'
    })
    async enableOrganizationUnit(@Param('id') unitId: string) {
        try {
            return new Response(true, [ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_ENABLED]).setSuccessData(await this.organizationUnitService.enableOrganizationUnit(unitId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(ORGANIZATION_UNIT_CONSTANT.CANNOT_ENABLE_ORGANIZATION_UNIT, err);
        }
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
    @ApiOkResponse({
        description: 'Organization Unit Deleted'
    })
    async deleteOrganizationUnit(@Param('id') id: string): Promise<Response> {
        try {
            return new Response(true, [ORGANIZATION_UNIT_CONSTANT.ORGANIZATION_UNIT_DELETED]).setSuccessData(await this.organizationUnitService.deleteOrganizationUnit(id)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(ORGANIZATION_UNIT_CONSTANT.CANNOT_DELETE_ORGANIZATION_UNIT, err);
        }
    }
}

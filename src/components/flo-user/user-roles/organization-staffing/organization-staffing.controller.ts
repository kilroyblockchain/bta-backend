import { Request } from 'express';
import { CreateStaffingDto } from './dto/createorganization-staffing.dto';
import { AuthGuard } from '@nestjs/passport';
import { OrganizationStaffingService } from './organization-staffing.service';
import { ApiBearerAuth, ApiTags, ApiHeader, ApiOperation, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Controller, UseGuards, Post, HttpCode, HttpStatus, Body, Get, Param, Put, Delete, Req, BadRequestException, NotFoundException } from '@nestjs/common';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { Roles, Permission, Feature } from 'src/components/auth/decorators';
import { Response } from 'src/@core/response';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { SubscriptionGuard } from 'src/components/auth/guards/subscription.guard';
import { ORGANIZATION_STAFFING_CONSTANT } from 'src/@core/constants/api-error-constants';

@ApiTags('Organization Staffing')
@UseGuards(RolesGuard)
@Controller('organization-staffing')
export class OrganizationStaffingController {
    constructor(private readonly staffingService: OrganizationStaffingService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_STAFFING)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Create New Organization Staffing' })
    @ApiCreatedResponse({
        description: 'Organization Staffing has been successfully added.'
    })
    async createNewStaffing(@Body() newStaff: CreateStaffingDto): Promise<Response> {
        try {
            const staff = await this.staffingService.createNewStaffing(newStaff);
            return new Response(true, [ORGANIZATION_STAFFING_CONSTANT.NEW_STAFFING_CREATED]).setSuccessData(staff).setStatus(HttpStatus.CREATED);
        } catch (err) {
            throw new BadRequestException(ORGANIZATION_STAFFING_CONSTANT.STAFFING_NOT_CREATED, err);
        }
    }

    @Get('unit/:unitId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_STAFFING)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Get Staffing By Organization Unit Id' })
    @ApiOkResponse({
        description: 'All Staffing Retireved Successfully.'
    })
    async getStaffingByOrganizationUnitId(@Param('unitId') unitId: string): Promise<Response> {
        try {
            return new Response(true, [ORGANIZATION_STAFFING_CONSTANT.ORGANIZATION_UNIT_STAFFING_RETRIEVED]).setSuccessData(await this.staffingService.getStaffingByOrganizationUnitId(unitId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(ORGANIZATION_STAFFING_CONSTANT.STAFFING_RECORD_NOT_FOUND, err);
        }
    }

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_STAFFING)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Get All Organization Staffing' })
    @ApiOkResponse({
        description: 'All Organization Staffing Retireved Successfully.'
    })
    async getAllOrganizationStaffing(@Req() req: Request): Promise<Response> {
        try {
            return new Response(true, [ORGANIZATION_STAFFING_CONSTANT.ALL_STAFFING_RETRIEVED]).setSuccessData(await this.staffingService.getAllOrganizationStaffing(req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(ORGANIZATION_STAFFING_CONSTANT.STAFFING_RECORD_NOT_FOUND, err);
        }
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_STAFFING)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Get Organization Staffing By Id' })
    @ApiOkResponse({
        description: 'Organization Staffing Found.'
    })
    async getStaffingById(@Param('id') id: string): Promise<Response> {
        try {
            return new Response(true, [ORGANIZATION_STAFFING_CONSTANT.STAFFING_RETRIEVED]).setSuccessData(await this.staffingService.getStaffingById(id)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(ORGANIZATION_STAFFING_CONSTANT.STAFFING_RECORD_NOT_FOUND, err);
        }
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_STAFFING)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Update Organization Staffing' })
    @ApiOkResponse({
        description: 'Organization Unit has been successfully updated.'
    })
    async updateOrganizationStaffing(@Body() updateStaff: CreateStaffingDto, @Param('id') id: string): Promise<Response> {
        try {
            return new Response(true, [ORGANIZATION_STAFFING_CONSTANT.STAFFING_RECORD_UPDATED]).setSuccessData(await this.staffingService.updateOrganizationStaffing(id, updateStaff)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(ORGANIZATION_STAFFING_CONSTANT.UNABLE_TO_UPDATE_STAFFING, err);
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Permission(ACCESS_TYPE.DELETE)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_STAFFING)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Delete Organization Staffing' })
    @ApiOkResponse({
        description: 'Organization Staff Deleted'
    })
    async deleteOrganizationStaffing(@Param('id') id: string): Promise<Response> {
        try {
            return new Response(true, [ORGANIZATION_STAFFING_CONSTANT.STAFFING_RECORD_DELETED]).setSuccessData(await this.staffingService.deleteOrganizationStaffing(id)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(ORGANIZATION_STAFFING_CONSTANT.UNABLE_TO_DELETE_STAFFING, err);
        }
    }

    @Put('enable-organization-staffing/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_STAFFING)
    @Permission(ACCESS_TYPE.UPDATE)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Enable Organization staffing' })
    @ApiOkResponse({
        description: 'Organization staffing Enabled'
    })
    async enableOrganizationUnit(@Param('id') staffingId: string) {
        try {
            return new Response(true, [ORGANIZATION_STAFFING_CONSTANT.ORGANIZATION_STAFFING_ENABLED]).setSuccessData(await this.staffingService.enableOrganizationStaffing(staffingId)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new BadRequestException(ORGANIZATION_STAFFING_CONSTANT.UNABLE_TO_ENABLE_STAFFING, err);
        }
    }
}

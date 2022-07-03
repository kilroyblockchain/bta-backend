import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Body, Controller, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Req, Put, UseGuards, Param, Get } from '@nestjs/common';
import { ApiOperation, ApiCreatedResponse, ApiTags, ApiHeader, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/@core/utils/file-upload.utils';
import { Request } from 'express';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { Roles, Permission, Feature } from 'src/components/auth/decorators';
import { AuthGuard } from '@nestjs/passport';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { PermissionGuard } from 'src/components/auth/guards/permission.guard';
import { SubscriptionGuard } from 'src/components/auth/guards/subscription.guard';
import { BlockchainStatusGuard } from 'src/components/auth/guards/blockhainStatus.guard';
import { ORGANIZATION_CONSTANT } from 'src/@core/constants/api-error-constants';
import { Response as FLOResponse } from 'src/@core/response';

@ApiTags('organization')
@UseGuards(RolesGuard)
@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create Organization' })
    @ApiCreatedResponse({})
    async createOrganization(@Req() req: Request, @UploadedFile() file, @Body() createOrganizationDto: CreateOrganizationDto): Promise<FLOResponse> {
        const organization = await this.organizationService.create(req, file?.filename, createOrganizationDto);
        return new FLOResponse(true, [ORGANIZATION_CONSTANT.ORGANIZATION_CREATED]).setSuccessData(organization).setStatus(HttpStatus.CREATED);
    }

    @Put(':organizationId')
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_DETAIL)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Edit Organization' })
    @ApiOkResponse({})
    async updateOrganization(@Param('organizationId') organizationId: string, @UploadedFile() file, @Body() updateOrganizationDto: UpdateOrganizationDto): Promise<FLOResponse> {
        const updatedOrganization = await this.organizationService.update(organizationId, file?.filename, updateOrganizationDto);
        return new FLOResponse(true, [ORGANIZATION_CONSTANT.ORGANIZATION_UPDATED]).setSuccessData(updatedOrganization).setStatus(HttpStatus.OK);
    }

    @Get('all-company-names')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get All Organization Names' })
    @ApiOkResponse({})
    async getAllOrganizationNames(): Promise<FLOResponse> {
        const organizations = await this.organizationService.findAllOrganizationName();
        return new FLOResponse(true, [ORGANIZATION_CONSTANT.ALL_ORGANIZATIONS_NAME_FETCHED]).setSuccessData(organizations).setStatus(HttpStatus.OK);
    }

    @Get(':organizationId')
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard, BlockchainStatusGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.ORGANIZATION_DETAIL)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get Organization' })
    @ApiOkResponse({})
    async getOrganizationById(@Param('organizationId') organizationId: string): Promise<FLOResponse> {
        const organization = await this.organizationService.findOrganizationByIdBcVerified(organizationId);
        return new FLOResponse(true, [ORGANIZATION_CONSTANT.ORGANIZATION_FOUND]).setSuccessData(organization).setStatus(HttpStatus.OK);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), PermissionGuard, SubscriptionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.MANAGE_ALL_USER)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get All Organization' })
    @ApiOkResponse({})
    async getAllOrganization(@Req() req: Request): Promise<FLOResponse> {
        const allOrganizations = await this.organizationService.findAllOrganization(req);
        return new FLOResponse(true, [ORGANIZATION_CONSTANT.ORGANIZATION_FOUND]).setSuccessData(allOrganizations).setStatus(HttpStatus.OK);
    }
}

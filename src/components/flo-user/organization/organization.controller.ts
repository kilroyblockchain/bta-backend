import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Body, Controller, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Req, Put, UseGuards, Param, Get, NotFoundException } from '@nestjs/common';
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
import { BC_SUCCESS_RESPONSE } from 'src/@core/constants/bc-constants/bc-success-response.constants';
import { Response } from 'src/@core/response';
import { ORGANIZATION_CONSTANT } from 'src/@core/constants/api-error-constants';

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
    async createOrganization(@Req() req: Request, @UploadedFile() file, @Body() createOrganizationDto: CreateOrganizationDto) {
        return await this.organizationService.create(req, file?.filename, createOrganizationDto);
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
    async updateOrganization(@Param('organizationId') organizationId: string, @UploadedFile() file, @Body() updateOrganizationDto: UpdateOrganizationDto, @Req() req: Request) {
        return await this.organizationService.update(organizationId, file?.filename, updateOrganizationDto, req);
    }

    @Get('all-company-names')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get All Organization Names' })
    @ApiOkResponse({})
    async getAllOrganizationNames() {
        try {
            return await this.organizationService.findAllOrganizationName();
        } catch (err) {
            throw new NotFoundException(ORGANIZATION_CONSTANT.ORGANIZATIONS_NOT_FOUND, err);
        }
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
    async getOrganizationById(@Param('organizationId') organizationId: string, @Req() req: Request) {
        return await this.organizationService.findOrganizationByIdBcVerified(organizationId, req);
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
    async getAllOrganization(@Req() req: Request) {
        try {
            const data = await this.organizationService.findAllOrganization(req);
            return { success: true, data };
        } catch (err) {
            throw new NotFoundException(ORGANIZATION_CONSTANT.ORGANIZATIONS_NOT_FOUND, err);
        }
    }

    @Get('blockchain-history/:organizationId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard, BlockchainStatusGuard)
    @Feature(FEATURE_IDENTIFIER.BLOCKCHAIN_HISTORY)
    @Permission(ACCESS_TYPE.READ)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOperation({ summary: 'Get Blockchain History of given oraganization' })
    @ApiOkResponse({
        description: 'Organization Blockchain history retireved successfully.',
        type: Response
    })
    async getBlockchainHistory(@Req() req: Request, @Param('organizationId') organizationId: string): Promise<Response> {
        return new Response(true, [BC_SUCCESS_RESPONSE.BLOCKCHAIN_HISTORY_FOUND]).setSuccessData(await this.organizationService.findOrganizationBlockchainHistory(req, organizationId));
    }
}

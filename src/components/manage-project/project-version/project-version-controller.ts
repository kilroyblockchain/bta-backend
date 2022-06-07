import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, MANAGE_PROJECT_CONSTANT, ROLE } from 'src/@core/constants';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard, RolesGuard } from 'src/components/auth/guards';
import { Feature, Permission, Roles } from 'src/components/auth/decorators';
import { AddVersionDto, VersionResponseDto } from './dto';
import { ProjectVersionService } from './project-version.service';
import { Response as FLOResponse } from 'src/@core/response';
import { Request } from 'express';

@ApiTags('Project Version')
@UseGuards(RolesGuard)
@Controller('project-version')
export class ProjectVersionController {
    constructor(private readonly versionService: ProjectVersionService) {}

    @Post(':id')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.MANAGE_PROJECT)
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Add new version in project' })
    @ApiParam({ name: 'id', required: true, description: 'Project Id' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_ADD_VERSION })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: MANAGE_PROJECT_CONSTANT.PROJECT_VERSION_CONFLICT })
    @ApiResponse({ status: HttpStatus.CREATED, type: VersionResponseDto, description: MANAGE_PROJECT_CONSTANT.NEW_VERSION_ADDED_SUCCESS })
    async addVersion(@Body() newVersion: AddVersionDto, @Req() req: Request, @Param('id') projectId: string): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.NEW_VERSION_ADDED_SUCCESS]).setSuccessData(await this.versionService.addNewVersion(req, projectId, newVersion)).setStatus(HttpStatus.CREATED);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_ADD_VERSION, err);
        }
    }
}

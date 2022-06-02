import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { Response as FLOResponse } from 'src/@core/response';
import { CreateProjectDto, ProjectResponseDto } from './dto';
import { PROJECT_CONSTANT } from 'src/@core/constants/api-error-constants';
import { PermissionGuard, RolesGuard } from 'src/components/auth/guards';
import { AuthGuard } from '@nestjs/passport';
import { Feature, Permission, Roles } from 'src/components/auth/decorators';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Request } from 'express';

@ApiTags('Project')
@UseGuards(RolesGuard)
@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post('create')
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
    @ApiOperation({ summary: 'Created New Project' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: PROJECT_CONSTANT.UNABLE_TO_CREATE_PROJECT })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: PROJECT_CONSTANT.PROJECT_NAME_CONFLICT })
    @ApiResponse({ status: HttpStatus.CREATED, type: ProjectResponseDto, description: PROJECT_CONSTANT.NEW_PROJECT_CREATED })
    async createProject(@Body() newProject: CreateProjectDto, @Req() req: Request): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [PROJECT_CONSTANT.NEW_PROJECT_CREATED]).setSuccessData(await this.projectService.createNewProject(newProject, req)).setStatus(HttpStatus.CREATED);
        } catch (err) {
            throw new BadRequestException(PROJECT_CONSTANT.UNABLE_TO_CREATE_PROJECT, err);
        }
    }
}

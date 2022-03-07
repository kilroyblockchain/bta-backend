import { editFileName, getLeaveSignatureDestination, imageFileFilter } from 'src/@core/utils/file-upload.utils';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/components/auth/decorators/roles.decorator';
import { Feature } from 'src/components/auth/decorators/feature.decorator';
import { ACCESS_TYPE } from 'src/@core/constants/accessType.enum';
import { Permission } from 'src/components/auth/decorators/permission.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Controller, Post, UseGuards, HttpCode, HttpStatus, Body, Req, Get, Param, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { LeaveApplicationService } from './leave-application.service';
import { FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { LeaveApplicationDto, LeaveResponseDto } from './dto/leave-application.dto';
import { Request } from 'express';
import { Response as FLOResponse } from 'src/@core/response';
import { LEAVE_APPLICATION_CONSTANT } from 'src/@core/constants/api-error-constants';

@ApiTags('leave Application')
@Controller('leave-application')
export class LeaveApplicationController {
    constructor(private readonly leaveApplicationService: LeaveApplicationService) {}

    @UseInterceptors(
        FileInterceptor('signature', {
            storage: diskStorage({
                destination: getLeaveSignatureDestination,
                filename: editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    @Post()
    @UseGuards(AuthGuard('jwt'))
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.LEAVE_APPLICATION)
    @Roles(ROLE.STAFF)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Add Leave Application' })
    async addLeave(@Body() createDto: LeaveApplicationDto, @UploadedFile() file, @Req() req: Request): Promise<FLOResponse> {
        const Leave = await this.leaveApplicationService.createLeave(createDto, req, file);
        return new FLOResponse(true, [LEAVE_APPLICATION_CONSTANT.NEW_LEAVE_APPLICATION_CREATED]).setSuccessData(Leave).setStatus(HttpStatus.CREATED);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.LEAVE_APPLICATION)
    @Roles(ROLE.STAFF)
    @HttpCode(HttpStatus.OK)
    @ApiQuery({ name: 'page', enum: [1, 2, 3] })
    @ApiQuery({ name: 'limit', enum: [10, 15] })
    @ApiQuery({ name: 'status', enum: ['true', 'false'] })
    @ApiQuery({ name: 'isStaff', enum: ['true', 'false'] })
    @ApiOperation({ summary: 'Get all leave applications of a company' })
    async getAllLeaves(@Req() req: Request): Promise<FLOResponse> {
        const Leaves = await this.leaveApplicationService.findAllLeaves(req);
        return new FLOResponse(true, [LEAVE_APPLICATION_CONSTANT.ALL_LEAVE_APPLICATIONS_FETCHED]).setSuccessData(Leaves).setStatus(HttpStatus.OK);
    }

    @Get(':leaveId')
    @UseGuards(AuthGuard('jwt'))
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.LEAVE_APPLICATION)
    @Roles(ROLE.STAFF)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get a leave application from Id' })
    async getLeaveFromId(@Param('leaveId') leaveId: string): Promise<FLOResponse> {
        const Leave = await this.leaveApplicationService.findLeaveApplicationById(leaveId);
        return new FLOResponse(true, [LEAVE_APPLICATION_CONSTANT.LEAVE_APPLICATION_DETAIL_FOUND]).setSuccessData(Leave).setStatus(HttpStatus.OK);
    }

    @Put('change-status/:id')
    @UseGuards(AuthGuard('jwt'))
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.LEAVE_APPLICATION)
    @Roles(ROLE.STAFF)
    @HttpCode(HttpStatus.OK)
    @ApiQuery({ name: 'status', enum: ['true', 'false'] })
    @ApiOperation({ summary: 'Change Current Status of Leave Application' })
    async updateLeaveStatus(@Param('id') id: string, @Req() req: Request): Promise<FLOResponse> {
        const updatedLeave = await this.leaveApplicationService.changeLeaveStatus(id, req);
        return new FLOResponse(true, [LEAVE_APPLICATION_CONSTANT.LEAVE_APPLICATION_STATUS_UPDATED]).setSuccessData(updatedLeave).setStatus(HttpStatus.OK);
    }

    @UseInterceptors(
        FileInterceptor('signature', {
            storage: diskStorage({
                destination: getLeaveSignatureDestination,
                filename: editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    @Put('leave-response/:id')
    @UseGuards(AuthGuard('jwt'))
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.LEAVE_APPLICATION)
    @Roles(ROLE.STAFF)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Accept leave' })
    async acceptLeaveApplication(@Param('id') id: string, @Body() leaveResponseDto: LeaveResponseDto, @Req() req: Request, @UploadedFile() file): Promise<FLOResponse> {
        const updatedLeave = await this.leaveApplicationService.respondLeaveStatus(id, req, leaveResponseDto, file);
        return new FLOResponse(true, [LEAVE_APPLICATION_CONSTANT.LEAVE_APPLICATION_STATUS_UPDATED]).setSuccessData(updatedLeave).setStatus(HttpStatus.OK);
    }

    @UseInterceptors(
        FileInterceptor('signature', {
            storage: diskStorage({
                destination: getLeaveSignatureDestination,
                filename: editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.LEAVE_APPLICATION)
    @Roles(ROLE.STAFF)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update Leave' })
    async updateLeave(@Param('id') id: string, @UploadedFile() file, @Body() updateDto: LeaveApplicationDto): Promise<FLOResponse> {
        const updatedLeave = await this.leaveApplicationService.updateLeave(id, updateDto, file);
        return new FLOResponse(true, [LEAVE_APPLICATION_CONSTANT.LEAVE_APPLICATION_UPDATED]).setSuccessData(updatedLeave).setStatus(HttpStatus.OK);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @Permission(ACCESS_TYPE.DELETE)
    @Feature(FEATURE_IDENTIFIER.LEAVE_APPLICATION)
    @Roles(ROLE.STAFF)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete Leave' })
    async deleteLeave(@Param('id') id: string): Promise<FLOResponse> {
        await this.leaveApplicationService.deleteLeave(id);
        return new FLOResponse(true, [LEAVE_APPLICATION_CONSTANT.LEAVE_APPLICATION_DELETED]).setSuccessData(true).setStatus(HttpStatus.OK);
    }
}

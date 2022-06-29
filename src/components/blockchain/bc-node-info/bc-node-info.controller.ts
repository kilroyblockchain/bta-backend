import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { BC_NODE_INFO_CONSTANT } from 'src/@core/constants/api-error-constants/bc-node-info-constant';
import { Feature, Permission, Roles } from 'src/components/auth/decorators';
import { PermissionGuard, RolesGuard } from 'src/components/auth/guards';
import { BcNodeInfoService } from './bc-node-info.service';
import { BcNodeInfoResponseDto } from './dto/bc-node-info-response.dto';
import { CreateBcNodeInfoDto } from './dto/create-bc-node-info.dto';
import { Response as FLOResponse } from 'src/@core/response';
import { Request } from 'express';

@ApiTags('BcNodeInfo')
@UseGuards(RolesGuard)
@Controller('bc-node-info')
export class BcNodeInfoController {
    constructor(private readonly bcNodeInfoService: BcNodeInfoService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.BC_NODE_INFO)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Add Blockchain Node Info' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: BC_NODE_INFO_CONSTANT.BC_NODE_INFO_ADD_FAILED })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: BC_NODE_INFO_CONSTANT.BC_NODE_INFO_ALREADY_EXISTS })
    @ApiResponse({ status: HttpStatus.CREATED, type: BcNodeInfoResponseDto, description: BC_NODE_INFO_CONSTANT.BC_NODE_INFO_ADDED })
    async addBcNodeInfo(@Body() createBcNodeInfoDto: CreateBcNodeInfoDto, @Req() req: Request): Promise<FLOResponse> {
        return new FLOResponse(true, [BC_NODE_INFO_CONSTANT.BC_NODE_INFO_ADDED]).setSuccessData(await this.bcNodeInfoService.addBcNodeInfo(createBcNodeInfoDto, req)).setStatus(HttpStatus.CREATED);
    }

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.BC_NODE_INFO)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Get all Blockchain Node Info' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BC_NODE_INFO_CONSTANT.BC_NODE_INFO_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.OK, type: BcNodeInfoResponseDto, description: BC_NODE_INFO_CONSTANT.FETCHED_ALL_BC_NODE_INFO })
    async getAllBcNodeInfo(@Req() req: Request): Promise<FLOResponse> {
        return new FLOResponse(true, [BC_NODE_INFO_CONSTANT.FETCHED_ALL_BC_NODE_INFO]).setSuccessData(await this.bcNodeInfoService.getAllBcNodeInfo(req)).setStatus(HttpStatus.OK);
    }

    @Put('update/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.BC_NODE_INFO)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Update Blockchain Node Info' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: BC_NODE_INFO_CONSTANT.BC_NODE_INFO_UPDATE_FAILED })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: BC_NODE_INFO_CONSTANT.BC_NODE_INFO_ALREADY_EXISTS })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BC_NODE_INFO_CONSTANT.BC_NODE_INFO_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.OK, type: BcNodeInfoResponseDto, description: BC_NODE_INFO_CONSTANT.BC_NODE_INFO_UPDATED })
    async updateBcNodeInfo(@Param('id') id: string, @Body() updateBcNodeInfo: CreateBcNodeInfoDto): Promise<FLOResponse> {
        return new FLOResponse(true, [BC_NODE_INFO_CONSTANT.BC_NODE_INFO_UPDATED]).setSuccessData(await this.bcNodeInfoService.updateBcNodeInfo(id, updateBcNodeInfo)).setStatus(HttpStatus.OK);
    }

    @Delete('delete/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permission(ACCESS_TYPE.DELETE)
    @Feature(FEATURE_IDENTIFIER.BC_NODE_INFO)
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Delete/disable Bc Node Info', description: 'This is soft delete api which change status of bcNodeInfo to false' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: BC_NODE_INFO_CONSTANT.BC_NODE_INFO_DELETE_FAILED })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BC_NODE_INFO_CONSTANT.BC_NODE_INFO_NOT_FOUND })
    @ApiResponse({ status: HttpStatus.OK, type: BcNodeInfoResponseDto, description: BC_NODE_INFO_CONSTANT.BC_NODE_INFO_DELETED })
    async deleteBcNodeInfo(@Param('id') id: string): Promise<FLOResponse> {
        return new FLOResponse(true, [BC_NODE_INFO_CONSTANT.BC_NODE_INFO_DELETED]).setSuccessData(await this.bcNodeInfoService.deleteBcNodeInfo(id)).setStatus(HttpStatus.OK);
    }
}

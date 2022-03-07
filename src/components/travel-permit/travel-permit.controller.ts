import { TRAVEL_PERMIT_CONSTANT } from 'src/@core/constants/api-error-constants';
import { TravelPermitDto } from './dto/travel-permit.dto';
import { Roles } from 'src/components/auth/decorators/roles.decorator';
import { Feature } from 'src/components/auth/decorators/feature.decorator';
import { Permission } from 'src/components/auth/decorators/permission.decorator';
import { ACCESS_TYPE } from 'src/@core/constants/accessType.enum';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TravelPermitService } from './travel-permit.service';
import { Controller, Post, UseGuards, HttpCode, HttpStatus, Body, Req, Get, Param, Put, Delete } from '@nestjs/common';
import { FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Request } from 'express';
import { Response as FLOResponse } from 'src/@core/response';

@ApiTags('Travel Permit')
@Controller('travel-permit')
export class TravelPermitController {
    constructor(private readonly travelPermitService: TravelPermitService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.TRAVEL_PERMIT)
    @Roles(ROLE.STAFF)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Add Travel Permit' })
    async addTravelPermit(@Body() createDto: TravelPermitDto, @Req() req: Request): Promise<FLOResponse> {
        const travelPermit = await this.travelPermitService.createTravelPermit(createDto, req);
        return new FLOResponse(true, [TRAVEL_PERMIT_CONSTANT.NEW_TRAVEL_PERMIT_CREATED]).setSuccessData(travelPermit).setStatus(HttpStatus.CREATED);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.TRAVEL_PERMIT)
    @Roles(ROLE.STAFF)
    @HttpCode(HttpStatus.OK)
    @ApiQuery({ name: 'page', enum: [1, 2, 3] })
    @ApiQuery({ name: 'limit', enum: [10, 15] })
    @ApiQuery({ name: 'status', enum: ['true', 'false'] })
    @ApiQuery({ name: 'isStaff', enum: ['true', 'false'] })
    @ApiOperation({ summary: 'Get all travel permits' })
    async getAllTravelPermits(@Req() req: Request): Promise<FLOResponse> {
        const travelPermits = await this.travelPermitService.findAllTravelPermits(req);
        return new FLOResponse(true, [TRAVEL_PERMIT_CONSTANT.ALL_TRAVEL_PERMITS_FETCHED]).setSuccessData(travelPermits).setStatus(HttpStatus.OK);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.TRAVEL_PERMIT)
    @Roles(ROLE.STAFF)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get travel permit from Id' })
    async getTravelPermitFromId(@Param('id') id: string): Promise<FLOResponse> {
        const travelPermit = await this.travelPermitService.findTravelPermitById(id);
        return new FLOResponse(true, [TRAVEL_PERMIT_CONSTANT.TRAVEL_PERMIT_DETAIL_FOUND]).setSuccessData(travelPermit).setStatus(HttpStatus.OK);
    }

    @Put('change-status/:id')
    @UseGuards(AuthGuard('jwt'))
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.TRAVEL_PERMIT)
    @Roles(ROLE.STAFF)
    @HttpCode(HttpStatus.OK)
    @ApiQuery({ name: 'status', enum: ['true', 'false'] })
    @ApiOperation({ summary: 'Change Current Status of Travel Permit' })
    async updateTravelPermitStatus(@Param('id') id: string, @Req() req: Request): Promise<FLOResponse> {
        const updatedPermit = await this.travelPermitService.changePermitStatus(id, req);
        return new FLOResponse(true, [TRAVEL_PERMIT_CONSTANT.TRAVEL_PERMIT_STATUS_UPDATED]).setSuccessData(updatedPermit).setStatus(HttpStatus.OK);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @Permission(ACCESS_TYPE.UPDATE)
    @Feature(FEATURE_IDENTIFIER.TRAVEL_PERMIT)
    @Roles(ROLE.STAFF)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update Travel Permit' })
    async updateTravelPermit(@Param('id') id: string, @Body() updateDto: TravelPermitDto): Promise<FLOResponse> {
        const updatedTravelPermit = await this.travelPermitService.updateTravelPermit(id, updateDto);
        return new FLOResponse(true, [TRAVEL_PERMIT_CONSTANT.TRAVEL_PERMIT_UPDATED]).setSuccessData(updatedTravelPermit).setStatus(HttpStatus.OK);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @Permission(ACCESS_TYPE.DELETE)
    @Feature(FEATURE_IDENTIFIER.TRAVEL_PERMIT)
    @Roles(ROLE.STAFF)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete Travel Permit' })
    async deleteTravelPermit(@Param('id') id: string): Promise<FLOResponse> {
        await this.travelPermitService.deleteTravelPermit(id);
        return new FLOResponse(true, [TRAVEL_PERMIT_CONSTANT.TRAVEL_PERMIT_DELETED]).setSuccessData(true).setStatus(HttpStatus.OK);
    }
}

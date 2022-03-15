import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ROLE } from 'src/@core/constants';
import { FEATURES_CONSTANT } from 'src/@core/constants/api-error-constants';
import { Roles } from 'src/components/auth/decorators';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { FeatureService } from './features.service';
import { Response as FLOResponse } from 'src/@core/response';

@ApiTags('Feature api')
@UseGuards(RolesGuard)
@Controller('feature')
export class FeatureController {
    constructor(private readonly featureService: FeatureService) {}

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all Features' })
    async getAllFeatures(): Promise<FLOResponse> {
        const allFeatures = await this.featureService.getAllFeatures();
        return new FLOResponse(true, [FEATURES_CONSTANT.ALL_FEATURES_FETCHED_SUCCESSFULLY]).setSuccessData(allFeatures).setStatus(HttpStatus.OK);
    }

    @Get(':subscriptionType')
    @UseGuards(AuthGuard('jwt'))
    @Roles(ROLE.SUPER_ADMIN, ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all Features of one type' })
    async getAllFeaturesOfSubscriptionType(@Param('subscriptionType') subscriptionType: string, @Req() req: Request): Promise<FLOResponse> {
        const features = await this.featureService.getAllFeaturesOfSubscriptionType(req, subscriptionType);
        return new FLOResponse(true, [FEATURES_CONSTANT.SUBSCRIPTION_TYPE_FEATURES_FETCHED_SUCCESSFULLY]).setSuccessData(features).setStatus(HttpStatus.OK);
    }
}

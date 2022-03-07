import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards, NotFoundException, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Response } from 'src/@core/response';
import { ROLE } from 'src/@core/constants';
import { FEATURES_CONSTANT } from 'src/@core/constants/api-error-constants';
import { Roles } from 'src/components/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { FeatureService } from './features.service';

@ApiTags('Feature api')
@UseGuards(RolesGuard)
@Controller('feature')
export class FeatureController {
    constructor(private readonly featureService: FeatureService) {}

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all Features' })
    async getAllFeatures() {
        try {
            return new Response(true, [FEATURES_CONSTANT.ALL_FEATURES_FETCHED_SUCCESSFULLY]).setSuccessData(await this.featureService.getAllFeatures()).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(FEATURES_CONSTANT.FEATURES_NOT_FOUND, err);
        }
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
    async getAllFeaturesOfSubscriptionType(@Param('subscriptionType') subscriptionType: string, @Req() req: Request) {
        try {
            return new Response(true, [FEATURES_CONSTANT.SUBSCRIPTION_TYPE_FEATURES_FETCHED_SUCCESSFULLY]).setSuccessData(await this.featureService.getAllFeaturesOfSubscriptionType(req, subscriptionType)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(FEATURES_CONSTANT.SUBSCRIPTION_TYPE_FEATURE_FETCHED_FAILED, err);
        }
    }
}

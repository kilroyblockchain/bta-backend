import { Request } from 'express';
import { Controller, Get, HttpCode, HttpStatus, NotFoundException, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubscriptionTypeService } from './subscription-type.service';
import { Response } from 'src/@core/response';
import { SUBSCRIPTION_TYPE_CONSTANT } from 'src/@core/constants/api-error-constants';

@ApiTags('Subscription Types api')
@Controller('subscription-type')
export class SubscriptionTypeController {
    constructor(private readonly subscriptionTypeService: SubscriptionTypeService) {}

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all Subscriptions' })
    async getAllSubscriptionType(@Req() req: Request) {
        try {
            return new Response(true, [SUBSCRIPTION_TYPE_CONSTANT.ALL_SUBSCRIPTION_FETCH_SUCCESS]).setSuccessData(await this.subscriptionTypeService.getAllSubscription(req)).setStatus(HttpStatus.OK);
        } catch (err) {
            throw new NotFoundException(SUBSCRIPTION_TYPE_CONSTANT.FAILED_TO_FETCH_ALL_SUBSCRIPTION, err);
        }
    }
}

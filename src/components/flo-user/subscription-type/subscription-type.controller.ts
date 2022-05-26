import { Request } from 'express';
import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubscriptionTypeService } from './subscription-type.service';
import { SUBSCRIPTION_TYPE_CONSTANT } from 'src/@core/constants/api-error-constants';
import { Response as FLOResponse } from 'src/@core/response';
@ApiTags('Subscription Types api')
@Controller('subscription-type')
export class SubscriptionTypeController {
    constructor(private readonly subscriptionTypeService: SubscriptionTypeService) {}

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all Subscriptions' })
    async getAllSubscriptionType(@Req() req: Request): Promise<FLOResponse> {
        const allSubscriptions = await this.subscriptionTypeService.getAllSubscription(req);
        return new FLOResponse(true, [SUBSCRIPTION_TYPE_CONSTANT.ALL_SUBSCRIPTION_FETCH_SUCCESS]).setSuccessData(allSubscriptions).setStatus(HttpStatus.OK);
    }
}

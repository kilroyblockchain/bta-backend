import { VerificationService } from './verification.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Response as FLOResponse } from 'src/@core/response';
import { VERIFICATION_CONSTANT } from 'src/@core/constants/api-error-constants';
@ApiTags('Verification')
@Controller('verification')
export class VerificationController {
    constructor(private verificationService: VerificationService) {}

    @Get(':token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get the verification details from token' })
    async getLHASetting(@Param('token') token: string): Promise<FLOResponse> {
        return new FLOResponse(true, [VERIFICATION_CONSTANT.VERIFICATION_DETAILS_FOUND]).setSuccessData(await this.verificationService.getDetailsByToken(token)).setStatus(HttpStatus.OK);
    }
}

import { ApiTags, ApiOperation, ApiExtraModels } from '@nestjs/swagger';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { AppResponseDto } from 'src/@core/response/dto';
import { VERIFICATION_CONSTANT } from 'src/@core/constants/api-error-constants';
import { ApiOkAppResponseWithModel } from 'src/@core/response/decorators/api-response.decorator';
import { VerificationService } from 'src/components/app-user/verification/verification.service';
import { VerificationResponse } from 'src/components/app-user/verification/dto';
@ApiTags('Verification')
@Controller('verification')
@ApiExtraModels(AppResponseDto, VerificationResponse)
export class VerificationController {
    constructor(private verificationService: VerificationService) {}

    @Get(':token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get the verification details from token' })
    @ApiOkAppResponseWithModel(VerificationResponse)
    async getLHASetting(@Param('token') token: string): Promise<AppResponseDto<VerificationResponse>> {
        return new AppResponseDto<VerificationResponse>(true, [VERIFICATION_CONSTANT.VERIFICATION_DETAILS_FOUND]).setSuccessData(await this.verificationService.getDetailsByToken(token)).setStatus(HttpStatus.OK);
    }
}

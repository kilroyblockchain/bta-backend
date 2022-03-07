import { Controller, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Response } from 'src/@core/response';
import { ROLE, STATUS } from 'src/@core/constants';
import { COMPANY_TRANSFER_CONSTANT } from 'src/@core/constants/api-error-constants/company-transfer.constant';
import { Roles } from 'src/components/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { CompanyTransferService } from './company-transfer.service';

@Controller('company-transfer')
@ApiTags('Company Transfer')
@UseGuards(RolesGuard)
export class CompanyTransferController {
    constructor(private readonly companyTransferService: CompanyTransferService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @Roles(ROLE.SUPER_ADMIN)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get company transfer record according to status' })
    @ApiOkResponse({})
    async getCompanyTransferByStatus(@Req() req: Request) {
        const companyTransferData = await this.companyTransferService.getAllCompanyTransfer(req);
        if (companyTransferData.total <= 0) {
            throw new NotFoundException(COMPANY_TRANSFER_CONSTANT.COMPANY_TRANSFER_DATA_NOT_FOUND);
        }
        return new Response(true, [`FETCHED_COMPANY_TRANSFER_RECORD_WITH_STATUS_${!req.query.status || (req.query.status && req.query.status.toString().toLocaleUpperCase() === STATUS.PENDING) ? STATUS.PENDING : STATUS.COMPLETED}_SUCCESSFULLY`])
            .setSuccessData(companyTransferData)
            .setStatus(HttpStatus.OK);
    }

    @Get('transfer-token/:transferToken')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get company transfer data by token' })
    @ApiOkResponse({})
    async getCompanyTransferDataByToken(@Param('transferToken') transferToken: string) {
        const transferData = await this.companyTransferService.getTransferDataByToken(transferToken);
        if (!transferData) {
            throw new ForbiddenException(COMPANY_TRANSFER_CONSTANT.TRANSFER_TOKEN_EXPIRED_OR_INVALID);
        }
        return new Response(true, [COMPANY_TRANSFER_CONSTANT.FETCHED_COMPANY_TRANSFER_DATA_BY_TOKEN_SUCCESSFULLY]).setSuccessData(transferData).setStatus(HttpStatus.OK);
    }

    @Put('/refresh/:id')
    @UseGuards(AuthGuard('jwt'))
    @Roles(ROLE.SUPER_ADMIN)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh company transfer id which is not used' })
    @ApiOkResponse({})
    async refreshCompanyTransfer(@Param('id') transferId: string) {
        return new Response(true, [COMPANY_TRANSFER_CONSTANT.SUCCESSFULLY_REFRESH_COMPANY_TRANSFER]).setSuccessData(await this.companyTransferService.refreshCompanyTransfer(transferId)).setStatus(HttpStatus.OK);
    }
}

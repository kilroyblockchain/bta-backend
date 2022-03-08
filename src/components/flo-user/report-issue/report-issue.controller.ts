import { REPORT_ISSUE_CONSTANT } from 'src/@core/constants/api-error-constants';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateIssueReportDto } from './dto/create-issue-report.dto';
import { diskStorage } from 'multer';
import { editFileName, getIssueAttachmentDestination } from 'src/@core/utils/file-upload.utils';
import { Response } from 'src/@core/response';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/components/auth/decorators';
import { ReportIssueService } from './report-issue.service';
import { ROLE, STATUS } from 'src/@core/constants';

@Controller('report')
@UseGuards(RolesGuard)
@ApiTags('Issue Report')
export class ReportIssueController {
    constructor(private readonly CaseReportService: ReportIssueService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: getIssueAttachmentDestination,
                filename: editFileName
            })
        })
    )
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create Issue Report' })
    @ApiOkResponse({})
    async createIssueReport(@Body() createIssueDto: CreateIssueReportDto, @UploadedFile() file) {
        return new Response(true, [REPORT_ISSUE_CONSTANT.SUCCESSFULLY_CREATED_ISSUE_REPORT]).setSuccessData(await this.CaseReportService.createIssueReport(createIssueDto, file?.filename)).setStatus(HttpStatus.CREATED);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @Roles(ROLE.SUPER_ADMIN)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get Issue Reports' })
    @ApiOkResponse({})
    async getAllIssue(@Req() req: Request) {
        const allIssues = await this.CaseReportService.findAllIssues(req);
        return new Response(true, [REPORT_ISSUE_CONSTANT.SUCCESSFULLY_FETCHED_ALL_ISSUE]).setSuccessData(allIssues).setStatus(HttpStatus.OK);
    }

    @Put('approve/:issueId')
    @UseGuards(AuthGuard('jwt'))
    @Roles(ROLE.SUPER_ADMIN)
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Approve Issue Reports' })
    @ApiOkResponse({})
    async approveIssue(@Param('issueId') issueId: string, @Req() req: Request) {
        return new Response(true, [REPORT_ISSUE_CONSTANT.SUCCESSFULLY_APPROVED_BY_SUPER_ADMIN]).setSuccessData(await this.CaseReportService.changeIssueStatus(issueId, STATUS.APPROVED, req)).setStatus(HttpStatus.OK);
    }

    @Put('reject/:issueId')
    @UseGuards(AuthGuard('jwt'))
    @Roles('super-admin')
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reject Issue Reports' })
    @ApiOkResponse({})
    async rejectIssue(@Param('issueId') issueId: string, @Req() req: Request) {
        return new Response(true, [REPORT_ISSUE_CONSTANT.SUCCESSFULLY_REJECTED_BY_SUPER_ADMIN]).setSuccessData(await this.CaseReportService.changeIssueStatus(issueId, STATUS.REJECTED, req)).setStatus(HttpStatus.OK);
    }
}

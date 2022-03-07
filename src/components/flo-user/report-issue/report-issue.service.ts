import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { PaginateModel, PaginateResult } from 'mongoose';
import { MailService } from 'src/components/utils/mail/mail.service';
import { CompanyTransferService } from '../company-transfer/company-transfer.service';
import config from 'src/@core/config/keys';
import { CreateIssueReportDto } from './dto/create-issue-report.dto';
import { IReportIssueDoc } from './interfaces/report-issue.interface';
import { issueType } from './issueType.enum';
import { REPORT_ISSUE_CONSTANT } from 'src/@core/constants/api-error-constants';
import { EMAIL_CONSTANTS, STATUS } from 'src/@core/constants';

@Injectable()
export class ReportIssueService {
    constructor(
        @InjectModel('report')
        private readonly ReportModel: PaginateModel<IReportIssueDoc>,
        private readonly companyTransferService: CompanyTransferService,
        private readonly mailService: MailService
    ) {}

    async createIssueReport(createIssueDto: CreateIssueReportDto, attachment: string): Promise<IReportIssueDoc> {
        const newIssue = new this.ReportModel(createIssueDto);
        newIssue.proofAttachment = attachment;
        if (await this.companyTransferService.canCompanyTransfer(createIssueDto.companyName)) {
            return await newIssue.save();
        } else {
            throw new BadRequestException(REPORT_ISSUE_CONSTANT.COMPANY_NOT_REGISTERED);
        }
    }

    async findAllIssues(req: Request): Promise<PaginateResult<IReportIssueDoc>> {
        const { page, limit, status } = req.query;
        let query = {};
        if (status && status !== '') {
            query = { status: status.toString().toUpperCase() };
        }
        const options = {
            select: 'companyName issueType email description proofAttachment status subscriptionType createdAt ',
            sort: { updatedAt: -1 },
            lean: true,
            limit: Number(limit),
            page: Number(page)
        };
        return await this.ReportModel.paginate(query, options);
    }

    async changeIssueStatus(id: string, status: string, req: Request) {
        const updateRes = await this.ReportModel.updateOne({ _id: id, status: STATUS.PENDING }, { $set: { status: status, checkedBy: req['user']._id } });
        const issueDetail = await this.ReportModel.findById(id);
        if (updateRes && updateRes.modifiedCount === 1 && issueDetail && issueDetail.status !== STATUS.PENDING) {
            if (status === STATUS.APPROVED) {
                if (issueDetail.issueType === issueType.OWNERSHIP) {
                    await this.readyCompanyTransfer(issueDetail);
                }
            } else {
                await this.mailService.sendMail(issueDetail.email, EMAIL_CONSTANTS.FLO, EMAIL_CONSTANTS.TITLE_WELCOME, config.MAIL_TYPES.ISSUE_REJECTED, {
                    email: issueDetail.email,
                    issueType: issueDetail.issueType
                });
            }
            return issueDetail;
        } else {
            throw new BadRequestException(`FAILED_TO_${status === STATUS.APPROVED ? 'APPROVE' : 'REJECT'}_ISSUE`);
        }
    }

    async readyCompanyTransfer(issueDetail: IReportIssueDoc) {
        const companyTransfer = await this.companyTransferService.createCompanyTransfer(issueDetail);
        if (companyTransfer && companyTransfer.currentOwner) {
            await this.mailService.sendMail(companyTransfer.currentOwner['email'], EMAIL_CONSTANTS.FLO, EMAIL_CONSTANTS.TITLE_WELCOME, config.MAIL_TYPES.UNVERIFIED_USER_EMAIL, {
                userName: companyTransfer.currentOwner['firstName']
            });
        }
        const transferLink = `${process.env.CLIENT_APP_URL}/auth/company-transfer/${companyTransfer.transferToken}`;
        await this.mailService.sendMail(issueDetail.email, EMAIL_CONSTANTS.FLO, EMAIL_CONSTANTS.TITLE_WELCOME, config.MAIL_TYPES.COMPANY_TRANSFER_EMAIL, {
            email: issueDetail.email,
            transferLink: transferLink
        });
    }
}

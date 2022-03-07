import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { v4 } from 'uuid';
import { addDays } from 'date-fns';
import { UserService } from '../user/user.service';
import { ICompanyTransferDoc } from './interfaces/company-transfer.interface';
import { Request } from 'express';
import { MailService } from 'src/components/utils/mail/mail.service';
import config from 'src/@core/config/keys';
import { IReportIssueDoc } from '../report-issue/interfaces/report-issue.interface';
import { COMPANY_TRANSFER_CONSTANT } from 'src/@core/constants/api-error-constants/company-transfer.constant';
import { EMAIL_CONSTANTS, STATUS } from 'src/@core/constants';

@Injectable()
export class CompanyTransferService {
    constructor(
        @InjectModel('CompanyTransfer')
        private readonly CompanyTransferModel: PaginateModel<ICompanyTransferDoc>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly mailService: MailService
    ) {}

    async createCompanyTransfer(issueDetail: IReportIssueDoc): Promise<ICompanyTransferDoc> {
        const adminDetail = await this.userService.getAdminOfCompany(issueDetail.companyName);
        if (adminDetail) {
            const transferToken = v4();
            const newCompanyTransfer = new this.CompanyTransferModel({
                issue: issueDetail._id,
                currentOwner: adminDetail.currentOwner,
                company: adminDetail.company,
                transferTo: issueDetail.email,
                transferToken: transferToken,
                expireIn: addDays(new Date(), 1)
            });
            await this.userService.unVerifyAllUsersByCompanyId(adminDetail.company);
            return await (await newCompanyTransfer.save()).populate('currentOwner company issue');
        } else {
            throw new BadRequestException(COMPANY_TRANSFER_CONSTANT.COMPANY_NOT_FOUND);
        }
    }

    async getAllCompanyTransfer(req: Request) {
        const { page, limit, status } = req.query;
        let query = {};
        if (status && status !== '') {
            query = { status: status.toString().toUpperCase() };
        }
        const options = {
            select: 'company createdAt currentOwner expireIn id isUsed issue status transferTo ',
            populate: {
                path: 'company currentOwner issue',
                select: 'companyName firstName lastName email issueType '
            },
            sort: { updatedAt: -1 },
            limit: Number(limit),
            page: Number(page)
        };
        return await this.CompanyTransferModel.paginate(query, options);
    }

    async refreshCompanyTransfer(transferId: string) {
        const currentCompanyTransfer = await this.CompanyTransferModel.findById(transferId);
        if (currentCompanyTransfer && currentCompanyTransfer.canRefresh) {
            const newTransferToken = v4();
            await currentCompanyTransfer.update({
                transferToken: newTransferToken,
                expireIn: addDays(new Date(), 1)
            });
            const transferLink = `${process.env.CLIENT_APP_URL}/auth/company-transfer/${newTransferToken}`;
            await this.mailService.sendMail(currentCompanyTransfer.transferTo, EMAIL_CONSTANTS.COMAPNY_TRANSFER_SUBJECT, EMAIL_CONSTANTS.TITLE_WELCOME, config.MAIL_TYPES.COMPANY_TRANSFER_EMAIL, {
                email: currentCompanyTransfer.transferTo,
                transferLink: transferLink
            });
            return true;
        } else {
            throw new BadRequestException(COMPANY_TRANSFER_CONSTANT.CANNOT_REFRESH_COMPANY_TRANSFER);
        }
    }

    async canCompanyTransfer(companyName: string) {
        try {
            await this.userService.getAdminOfCompany(companyName);
            return true;
        } catch (err) {
            return false;
        }
    }

    async getTransferDataByToken(transferToken: string): Promise<ICompanyTransferDoc> {
        return await this.CompanyTransferModel.findOne({
            transferToken: transferToken,
            isUsed: false,
            expireIn: { $gte: new Date() }
        }).populate('issue currentOwner company');
    }

    async useTransferToken(transferId: string) {
        await this.CompanyTransferModel.updateOne({ _id: transferId }, { isUsed: true, status: STATUS.COMPLETED });
    }
}

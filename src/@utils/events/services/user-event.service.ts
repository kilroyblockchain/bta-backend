import { Injectable, Logger } from '@nestjs/common';
import { MailTypes } from 'src/@utils/mail/enum/mail-type.enum';
import { MailService } from 'src/@utils/mail/mail.service';
import { BaseEmailDto } from '../dto';

@Injectable()
export class UserEventService {
    constructor(private readonly mailService: MailService) {}

    sendMail<T>(mailType: MailTypes, payload: BaseEmailDto<T>): void {
        const logger = new Logger(UserEventService.name + '-sendMail');
        const { to, subject, title, partialContext } = payload;
        this.mailService
            .sendMail(to, subject, title, mailType, partialContext)
            .then(() => {
                logger.log(`${mailType} - email sent`);
            })
            .catch((err) => {
                logger.error(err);
            });
    }
}

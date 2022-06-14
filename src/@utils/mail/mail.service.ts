import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as handlebars from 'handlebars';
import { MailResponse } from './interfaces/mail-response.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    constructor(private readonly config: ConfigService, private readonly mailerService: MailerService) {}

    async sendMail<T>(to: string, subject: string, title: string, mailType: string, partialContext: T): Promise<MailResponse> {
        let result: MailResponse;
        // To get the partials: the main body of mail template
        handlebars.registerHelper('whichMail', function () {
            return mailType;
        });
        // Sending email
        await this.mailerService
            .sendMail({
                to: to,
                from: process.env.EMAIL,
                subject: subject,
                template: __dirname + './rootmail',
                headers: { 'Content-Type': 'text/html; charset="UTF-8"' },
                context: {
                    // Data to be sent to template engine
                    title: title,
                    partialContext: partialContext ? { ...partialContext, appName: this.config.get('APP_NAME') ?? 'App' } : undefined,
                    clientAppURL: process.env.CLIENT_APP_URL
                }
            })
            .then(() => {
                result = {
                    success: true,
                    message: 'Send Success'
                };
            })
            .catch((error) => {
                result = {
                    success: false,
                    message: error.message
                };
            });
        return result;
    }
}

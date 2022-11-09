import 'dotenv/config';
import * as nodeMailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { consoleLogWrapper } from 'app-migrations/helper-func';

interface IMailContent {
    subscriptionType: string;
    email: string;
    password: string;
    bcKey: string;
}

export const sendMail = async (subject: string, receiverEmail: string, mailContext: IMailContent, mailType: string): Promise<void> => {
    const emailTemplateSource = fs.readFileSync(path.join(process.cwd(), '/dist/src/@utils/mail/templates/rootmail.hbs'), 'utf8');

    handlebars.registerHelper('whichMail', function () {
        return mailType;
    });

    handlebars.registerPartial(mailType, fs.readFileSync(path.join(process.cwd(), `/dist/src/@utils/mail/templates/partials/${mailType}.hbs`), 'utf-8'));

    const template = handlebars.compile(emailTemplateSource);
    const htmlToSend = template({ title: 'BTA', partialContext: mailContext ? { ...mailContext, appName: 'BTA' } : undefined, clientAppURL: process.env.CLIENT_APP_URL });

    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const info = await transporter.sendMail({
        from: `"BTA Support" <${process.env.EMAIL_USER}>`,
        to: receiverEmail,
        subject,
        html: htmlToSend
    });

    consoleLogWrapper('Message sent success:' + info.messageId);
};

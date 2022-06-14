import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    secureConnection: false,
                    host: process.env.EMAIL_HOST,
                    port: Number(process.env.EMAIL_PORT),
                    auth: {
                        user: process.env.EMAIL_USER ?? '',
                        pass: process.env.EMAIL_PASSWORD ?? ''
                    },
                    tls: { rejectUnauthorized: false }
                },
                defaults: {
                    from: '"nest-modules" <modules@nestjs.com>'
                },
                template: {
                    dir: process.cwd() + '/src/@utils/mail/templates/',
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                },
                options: {
                    partials: {
                        dir: process.cwd() + '/src/@utils/mail/templates/partials/',
                        options: {
                            strict: true
                        }
                    }
                }
            })
        })
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}

import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

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
                    dir: join(__dirname, '/templates/'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                },
                options: {
                    partials: {
                        dir: join(__dirname, '/templates/partials/'),
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

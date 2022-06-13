import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { warn } from 'console';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as cookieParser from 'cookie-parser';
import { UserModule } from './components/app-user/user/user.module';
import { OrganizationModule } from './components/app-user/organization/organization.module';
import { WinstonModule, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { consoleTransportOptions, dailyRotateFileTransportOptions } from './@core/config/logger.config';
import { VerificationModule } from './components/app-user/verification/verification.module';
import { UserRejectInfoModule } from './components/app-user/user-reject-info/user-reject-info.module';
import { ChannelDetailModule } from 'src/components/blockchain/channel-detail/channel-detail.module';
import { FilesModule } from './@utils/files/files.module';
import { OrganizationStaffingModule } from './components/app-user/user-roles/organization-staffing/organization-staffing.module';
import { OrganizationUnitModule } from './components/app-user/user-roles/organization-unit/organization-unit.module';
import { FeatureModule } from './components/app-user/features/features.module';
import { SubscriptionTypeModule } from './components/app-user/subscription-type/subscription-type.module';
import { CountryModule } from './components/app-user/country/country.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            transports: [new transports.Console(consoleTransportOptions), ...(process.env.NO_APP_LOG_T_FILE ? [] : [new DailyRotateFile(dailyRotateFileTransportOptions)])]
        })
    });
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    app.enableCors({ origin: true, credentials: true });
    app.setGlobalPrefix('api/v1');

    // Request Validation
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // Helmet Middleware against known security vulnerabilities
    app.use(helmet());

    app.use(cookieParser());

    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: Number(process.env.PAGE_VISIT_LIMIT), // limit each IP to 100 requests per windowMs
            message: {
                statusCode: 400,
                message: ['Too many requests from this IP, please try again later'],
                error: 'Bad Request'
            }
        })
    );

    const signupLimiter = rateLimit({
        windowMs: 30 * 60 * 1000, // half an hour window
        max: Number(process.env.SIGNUP_LIMIT), // start blocking after 5 requests
        message: {
            statusCode: 400,
            message: ['Too many request for accounts (creation or retrieval) from this IP, please try again after half an hour'],
            error: 'Bad Request'
        }
    });
    app.use('/api/v1/user/register', signupLimiter);
    app.use('/api/v1/user/login', signupLimiter);
    app.use('/api/v1/user/forgot-password', signupLimiter);
    app.use('/api/v1/user/reset-password', signupLimiter);

    const options = new DocumentBuilder().setTitle('FLO API').setDescription('API description').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, options, {
        include: [UserModule, OrganizationModule, VerificationModule, CountryModule, SubscriptionTypeModule, FeatureModule, OrganizationUnitModule, OrganizationStaffingModule, FilesModule, ChannelDetailModule, UserRejectInfoModule]
    });
    SwaggerModule.setup('api', app, document);

    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
    warn(`APP IS LISTENING TO PORT ${PORT}`);
}
bootstrap();

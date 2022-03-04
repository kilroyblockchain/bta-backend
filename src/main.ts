import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { warn } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
        error: 'Bad Request',
      },
    }),
  );

  const signupLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // half an hour window
    max: Number(process.env.SIGNUP_LIMIT), // start blocking after 5 requests
    message: {
      statusCode: 400,
      message: [
        'Too many request for accounts (creation or retrival) from this IP, please try again after half an hour',
      ],
      error: 'Bad Request',
    },
  });
  app.use('/api/v1/user/register', signupLimiter);
  app.use('/api/v1/user/login', signupLimiter);
  app.use('/api/v1/user/forgot-password', signupLimiter);
  app.use('/api/v1/user/reset-password', signupLimiter);

  const options = new DocumentBuilder()
    .setTitle('FLO API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [],
  });
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 8848;
  await app.listen(PORT);
  warn(`APP IS LISTENING TO PORT ${PORT}`);
}
bootstrap();

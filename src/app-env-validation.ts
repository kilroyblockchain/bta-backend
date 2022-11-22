import * as Joi from 'joi';
import 'dotenv/config';

const production = process.env.ENVIRONMENT === 'prod' || process.env.ENVIRONMENT === 'demo' || process.env.ENVIRONMENT === 'dev';
const mailCatcher = process.env.EMAIL_HOST === 'mailcatcherBta';

export const envValidationSchema = Joi.object({
    ENVIRONMENT: Joi.string().required().equal('local', 'test', 'dev', 'demo', 'prod'),
    APP_NAME: Joi.string().required(),
    CLIENT_APP_URL: Joi.string().required(),
    /**
     * Database
     */
    APP_DEBUG_PORT: production ? Joi.string().allow('').optional() : Joi.number().required(),
    MONGO_URI: Joi.string().required(),
    MONGO_HOST: Joi.string().required(),
    MONGO_USERNAME: production ? Joi.string().required() : Joi.string().allow('').optional(),
    MONGO_PASSWORD: production ? Joi.string().required() : Joi.string().allow('').optional(),
    DATABASE_NAME: Joi.string().required(),
    MONGO_DEBUG: Joi.boolean().required(),
    /**
     * Email
     */
    EMAIL_HOST: Joi.string().required(),
    EMAIL_PORT: Joi.number().required(),
    EMAIL_USER: mailCatcher ? Joi.string().allow('').optional() : Joi.string().required().email(),
    EMAIL_PASSWORD: mailCatcher ? Joi.string().allow('').optional() : Joi.string().required(),
    /**
     * Jwt Token
     */
    JWT_SECRET: Joi.string().required().min(10),
    ENCRYPT_JWT_SECRET: Joi.string().required().min(10),
    JWT_EXPIRATION: Joi.string().required(),
    REFRESH_TOKEN_EXPIRATION_MIN: Joi.number().required(),
    /**
     * Limits
     */
    SIGNUP_LIMIT: Joi.number().required(),
    PAGE_VISIT_LIMIT: Joi.number().required(),
    /**
     * Captcha Configs
     */
    RE_CAPTCHA_STATUS: production ? Joi.string().required().equal('ENABLED') : Joi.string().required().equal('ENABLED', 'DISABLED'),
    RE_CAPTCHA_SECRET: Joi.string().required().min(10),
    /**
     * App secrets
     */
    RESET_PASSWORD_SECRET: Joi.string().required().min(10),
    RESET_WRONG_PASSWORD_BLOCK_TOKEN: Joi.string().required().min(10),
    AUTHORIZATION_TOKEN: Joi.string().required().min(10),
    /**
     * Logger
     */
    NO_APP_LOG_T_FILE: Joi.string().allow('').optional(),
    APP_LOG_ZIPPED_ARCHIVE: Joi.boolean().allow('').optional(),
    APP_LOG_DATE_PATTERN: Joi.string().required(),
    APP_LOG_MAX_SIZE: Joi.string().required(),
    APP_LOG_MAX_FILES: Joi.string().required()
});

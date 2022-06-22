import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    ENVIRONMENT: Joi.string().required().equal('local', 'test', 'dev', 'prod'),
    APP_NAME: Joi.string().required(),
    CLIENT_APP_URL: Joi.string().required(),
    /**
     * Docker
     */
    // App
    APP_PORT: Joi.number().required(),
    LOCAL_CONTAINER_NAME: Joi.string().required(),
    DEV_CONTAINER_NAME: Joi.string().required(),
    PROD_CONTAINER_NAME: Joi.string().required(),
    // MongoDB
    MONGO_EXPRESS_UI_PORT: Joi.number().required(),
    DB_PORT: Joi.number().required(),
    MONGODB_CONTAINER_NAME: Joi.string().required(),
    MONGO_EXPRESS_UI_CONTAINER_NAME: Joi.string().required(),
    DATABASE_VOLUME_MOUNT: Joi.string().required(),
    // Mail catcher
    MAILCATCHER_CONTAINER_NAME: Joi.string().required(),
    MAILCATCHER_PORT: Joi.number().required(),
    /**
     * Database
     */
    APP_DEBUG_PORT: Joi.number().required(),
    MONGO_URI: Joi.string().required(),
    MONGO_HOST: Joi.string().required(),
    MONGO_USERNAME: Joi.string().required(),
    MONGO_PASSWORD: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),
    MONGO_DEBUG: Joi.boolean().required(),
    /**
     * Email
     */
    EMAIL_HOST: Joi.string().required(),
    EMAIL_PORT: Joi.number().required(),
    EMAIL_USER: Joi.string().required().email(),
    EMAIL_PASSWORD: Joi.string().required(),
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
    RE_CAPTCHA_STATUS: Joi.string().required().equal('ENABLED', 'DISABLED'),
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
    NO_APP_LOG_T_FILE: Joi.string().optional(),
    APP_LOG_ZIPPED_ARCHIVE: Joi.boolean().optional(),
    APP_LOG_DATE_PATTERN: Joi.string().required(),
    APP_LOG_MAX_SIZE: Joi.string().required(),
    APP_LOG_MAX_FILES: Joi.string().required(),
    /**
     * Blockchain
     */
    BLOCKCHAIN: Joi.string().required().equal('ENABLED', 'DISABLED')
});

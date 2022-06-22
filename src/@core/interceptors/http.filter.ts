import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const errResponse = exception.getResponse();
        const method = request.method;
        const url = request.url;
        const now = Date.now();
        const responseJson = {
            statusCode: status,
            message: typeof errResponse === 'object' ? errResponse['message'] : errResponse,
            error: typeof errResponse === 'object' ? errResponse['error'] : exception.message
        };
        Logger.error(`${method} ${url} ${Date.now() - now}ms ${JSON.stringify(responseJson)}`, exception.stack, HttpExceptionFilter.name);
        response.status(status).json(responseJson);
    }
}

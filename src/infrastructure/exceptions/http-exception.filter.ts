import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'nestjs-pino';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    const reason = exception.getResponse();

    this.logger.error(
      `HTTP Exception ---- Status: ${status} ---- Timestamp: ${new Date().toISOString()} ---- Message: ${message}`,
    );

    response.status(status).json({
      timestampUTC: new Date().toISOString(),
      reason,
      path: request.url,
    });
  }
}

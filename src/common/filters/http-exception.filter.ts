import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ERROR_CODES,
  ERROR_MESSAGES,
} from '../constants/response.constants';

@Catch()
export class HttpExceptionFilter
  implements ExceptionFilter
{
  private readonly statusToErrorMapping = {
    [HttpStatus.NOT_FOUND]: ERROR_CODES.NOT_FOUND,
    [HttpStatus.FORBIDDEN]: ERROR_CODES.FORBIDDEN,
    [HttpStatus.CONFLICT]: ERROR_CODES.CONFLICT,
    [HttpStatus.UNAUTHORIZED]:
      ERROR_CODES.UNAUTHORIZED,
    [HttpStatus.PAYLOAD_TOO_LARGE]:
      ERROR_CODES.PAYLOAD_TOO_LARGE,
  };

  private createErrorResponse(
    status: number,
    code: string,
    message: string,
    details?: any,
  ) {
    return {
      success: false,
      code,
      error_message: message,
      details,
      timestamp: new Date().toISOString(),
    };
  }

  catch(exception: unknown, host: ArgumentsHost) {
    console.error(
      'Exception occurred:',
      exception,
    );
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse =
        exception.getResponse() as any;

      // Handle any exception with code
      if (exceptionResponse.code) {
        const errorMessage =
          typeof ERROR_MESSAGES[
            exceptionResponse.code
          ] === 'function'
            ? ERROR_MESSAGES[
                exceptionResponse.code
              ](exceptionResponse.entity)
            : ERROR_MESSAGES[
                exceptionResponse.code
              ];

        response.status(status).json({
          success: false,
          code: exceptionResponse.code,
          error_message: errorMessage,
          details: exceptionResponse.details,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Handle unauthorized and other standard exceptions
      if (status === HttpStatus.UNAUTHORIZED) {
        response.status(status).json({
          success: false,
          code: ERROR_CODES.UNAUTHORIZED,
          error_message:
            ERROR_MESSAGES[
              ERROR_CODES.UNAUTHORIZED
            ],
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (
        status === HttpStatus.PAYLOAD_TOO_LARGE
      ) {
        response.status(status).json({
          success: false,
          code: ERROR_CODES.PAYLOAD_TOO_LARGE,
          error_message:
            ERROR_MESSAGES[
              ERROR_CODES.PAYLOAD_TOO_LARGE
            ],
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Handle custom response structure
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        if (
          exceptionResponse.success !== undefined
        ) {
          const {
            code: customCode,
            error_message: customMessage,
            details: customDetails,
          } = exceptionResponse;
          response
            .status(status)
            .json(
              this.createErrorResponse(
                status,
                customCode ||
                  ERROR_CODES.APP_SERVER_ERROR,
                customMessage ||
                  ERROR_MESSAGES[
                    ERROR_CODES.APP_SERVER_ERROR
                  ] ||
                  exception.message,
                customDetails,
              ),
            );
          return;
        }

        // Handle validation errors
        if (
          exception instanceof
            BadRequestException &&
          Array.isArray(exceptionResponse.message)
        ) {
          response
            .status(HttpStatus.BAD_REQUEST)
            .json({
              success: false,
              code: ERROR_CODES.VALIDATION_ERROR,
              error_message:
                ERROR_MESSAGES[
                  ERROR_CODES.VALIDATION_ERROR
                ],
              details: exceptionResponse.message,
              timestamp: new Date().toISOString(),
            });
          return;
        }

        const errorCode =
          this.statusToErrorMapping[status];
        if (errorCode) {
          response
            .status(status)
            .json(
              this.createErrorResponse(
                status,
                errorCode,
                ERROR_MESSAGES[errorCode](
                  exceptionResponse.entity,
                ),
              ),
            );
          return;
        }
      }
    }

    // Default error response
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        code: ERROR_CODES.APP_SERVER_ERROR,
        error_message:
          ERROR_MESSAGES[
            ERROR_CODES.APP_SERVER_ERROR
          ],
        timestamp: new Date().toISOString(),
      });
  }
}

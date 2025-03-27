import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import {
  SUCCESS_MESSAGES,
  SUCCESS_CODES,
} from '../constants/response.constants';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    const request = httpContext.getRequest();
    const method = request.method;

    return next.handle().pipe(
      map((data) => {
        const code =
          data?.code ||
          response.statusCode.toString();
        const entity = data?.entity;

        const baseResponse: ApiResponse<T> = {
          success: true,
          code,
          message:
            typeof SUCCESS_MESSAGES[code] ===
            'function'
              ? SUCCESS_MESSAGES[code](entity)
              : SUCCESS_MESSAGES[code] ||
                SUCCESS_MESSAGES[
                  SUCCESS_CODES.GENERAL_SUCCESS
                ],
        };

        if (method === 'DELETE') {
          baseResponse.timestamp =
            new Date().toISOString();
        }

        if (
          data?.data ||
          (data && typeof data !== 'object')
        ) {
          baseResponse['data'] =
            data?.data || data;
        }

        if (data?.meta) {
          baseResponse.meta = data.meta;
        }

        return baseResponse;
      }),
    );
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import 'reflect-metadata';

import { errorMessage } from '@app/common';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  private getSwaggerDescription(target: Function) {
    // @nestjs/swagger 데코레이터의 메타테이터에 접근
    const matadata = Reflect.getMetadata('swagger/apiResponse', target);
    const statusCode = Object.keys(matadata)[0];
    return matadata[statusCode]['description'];
  }

  private getErrorMessage(code: string): string | undefined {
    return errorMessage[code];
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const { statusCode } = context.switchToHttp().getResponse();
    const target = context.getHandler();

    return next.handle().pipe(
      map((data) => {
        return {
          statusCode,
          data,
          message: this.getSwaggerDescription(target),
        };
      }),

      catchError((err) =>
        throwError(() => {
          const { status, message } = err;
          if (!status || status === 500) {
            return new InternalServerErrorException();
          }
          const customMessage = this.getErrorMessage(message);
          return !!customMessage //
            ? new HttpException(customMessage, status)
            : err;
        }),
      ),
    );
  }
}

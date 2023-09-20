import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Util } from '@app/common';
import { CustomLoggerService } from '../module';

interface Response<T> {
  data: T;
}

@Injectable()
export class ServerErrorLoggingInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.setTarget('ServerErrorLoggingInterceptor');
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      tap({
        error: (err) => {
          if (Util.isServerError(err)) {
            err.targetClassName && this.logger.setTarget(err.targetClassName);
            return this.logger.error(err);
          }
        },
      }),
    );
  }
}

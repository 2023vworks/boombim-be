import { HttpException } from '@nestjs/common';

export class ErrorUtil {
  isServerError(error: Error | unknown) {
    return !(error instanceof HttpException);
  }
}

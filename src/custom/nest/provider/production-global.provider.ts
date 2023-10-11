import { HttpException } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RavenInterceptor } from 'nest-raven';
import {
  ResponseInterceptor,
  ServerErrorLoggingInterceptor,
  SlackSenderInterceptor,
} from '../interceptor';

/** 400 초과 409 미만 에러는 무시합니다. (제외: 401 ~ 408) */
const getExcludeClientError = (exception: HttpException) =>
  400 > exception.getStatus() || 409 < exception.getStatus(); // 400 초과 409 미만 에러는 무시합니다.(401 ~ 408)

/** 500미만 에러는 전부 무시 합니다. */
const getExcludeServerError = (exception: HttpException) =>
  500 > exception.getStatus(); // 500 미만 에러는 무시합니다.

/**
 * ### 운영서버에 사용할 전역 provider
 * 실행 순서
 * 1. ResponseInterceptor
 * 2. RavenInterceptor
 * 3. SlackSenderInterceptor
 * 4. ServerErrorLoggerInterceptor
 * 5. Controller(MVC)
 * 6. ServerErrorLoggerInterceptor
 * 7. SlackSenderInterceptor
 * 8. RavenInterceptor
 * 9. ResponseInterceptor
 */
export const ProductionProviders = [
  /* HTTP에러 헨들링 인터셉터(최초, 최종 호출) */
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor,
  },
  /* 서버에러 Sentry 전송용 인터셉터 */
  {
    provide: APP_INTERCEPTOR,
    useValue: new RavenInterceptor({
      filters: [
        {
          type: HttpException,
          // 필터 결과가 true이면 해당 exception을 무시합니다.
          filter: (exception: HttpException) =>
            getExcludeClientError(exception) &&
            getExcludeServerError(exception),
        },
      ],
    }),
  },
  /* 서버에러 슬렉 전송용 인터셉터 */
  {
    provide: APP_INTERCEPTOR,
    useClass: SlackSenderInterceptor,
  },
  /* 서버에러 로그 출력용 인터셉터 */
  {
    provide: APP_INTERCEPTOR,
    useClass: ServerErrorLoggingInterceptor,
  },
];

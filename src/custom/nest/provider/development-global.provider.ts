import { APP_INTERCEPTOR } from '@nestjs/core';

import {
  ResponseInterceptor,
  ServerErrorLoggingInterceptor,
} from '../interceptor';

/**
 * ### 개발서버(로컬)에 사용할 전역 provider
 * 실행 순서
 * 1. ResponseInterceptor
 * 4. ServerErrorLoggerInterceptor
 * 5. Controller(MVC)
 * 6. ServerErrorLoggerInterceptor
 * 9. ResponseInterceptor
 */
export const DevelopmentGlobalProviders = [
  /* HTTP에러 헨들링 인터셉터(최초, 최종 호출) */
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor,
  },
  /* 서버에러 로그 출력용 인터셉터 */
  {
    provide: APP_INTERCEPTOR,
    useClass: ServerErrorLoggingInterceptor,
  },
];

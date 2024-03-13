import {
  INestApplication,
  Logger,
  NestApplicationOptions,
  Type,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { json } from 'express';
import helmet, { HelmetOptions } from 'helmet';

import { CorsConfig, SentryConfig } from '@app/config';
import { httpLogger } from '@app/custom';
import { defaultGlobalValidationPipeOptions } from '../constant';
import { buildSwagger } from '../swagger';

type AppCreateOption = {
  appModule: Type<any>;
} & Pick<NestApplicationOptions, 'logger'>;
type BuildSwaggerType = typeof buildSwagger;
type SetMiddlewareOptions = { httpLogging?: boolean; globalPrefix?: string };
type SetSwaggerOptions = { docsPath: string };

export class NestBuilder {
  private _isRunning: boolean;

  private constructor(
    private readonly _app: INestApplication,
    private readonly _configService: ConfigService,
  ) {
    this._isRunning = false;
  }

  /**
   * AppModule 주입받아 Nest APP을 생성한다.
   * - 이 시점에 주입 받은 AppModule class가 생성되어 DI된다.
   * @param options
   * @param {Object} options.appModule - AppModule: Nest 최상위 모듈
   * @param {Object} options.logger
   * @returns
   */
  static async createApp(options: AppCreateOption): Promise<NestBuilder> {
    const { appModule, logger } = options;
    const app = await NestFactory.create<INestApplication>(appModule, {
      logger,
    });

    return new NestBuilder(app, app.get(ConfigService));
  }

  async runServer(): Promise<INestApplication> {
    await this._app //
      .useGlobalPipes(new ValidationPipe(defaultGlobalValidationPipeOptions))
      .listen(this._configService.get('port'));

    this._isRunning = true;
    return this._app;
  }

  setSwagger(builder: BuildSwaggerType, options: SetSwaggerOptions): this {
    this.throwErrorIfRunning();

    builder(options.docsPath, this._app);
    return this;
  }

  /**
   * 보안 설정(helmet) 설정
   * - swagger-ui를 http 배포환경에서 사용하려면 swagger ui 빌드 후에 선언되어야 한다.
   * @param options
   * @returns
   * @see https://github.com/scottie1984/swagger-ui-express/issues/212#issuecomment-825803088
   */
  setSecurity(options?: Readonly<HelmetOptions>) {
    this._app.use(helmet(options));
    return this;
  }

  /**
   * Express middleware 셋팅
   * @param options
   * @param options.globalPrifix - 사용하는 경우 반드시 Swagger 설정인 setDocs보다 먼저 셋팅되어야 한다.
   * @param options.httpLogging - http 요청에 대한 로깅 설정
   * @returns
   */
  setMiddleware(options: SetMiddlewareOptions = {}): this {
    this.throwErrorIfRunning();

    if (!!options.httpLogging) {
      const logger = this._app.get(Logger);
      this._app.use(httpLogger(logger));
    }
    if (!!options.globalPrefix) {
      this._app.setGlobalPrefix(options.globalPrefix); // Note: Swagger 빌드전에 적용해야 docs에 적용된다.
    }
    const { origin, ...other } = this._configService.get<CorsConfig>('cors');
    this._app.enableCors({
      ...other,
      origin: typeof origin === 'string' ? origin.split(',') : origin,
    });
    this._app.use(json({ limit: '50mb' }));
    return this;
  }

  initSentry(): this {
    const sentryConfig = this._configService.get<SentryConfig>('sentry');
    Sentry.init({
      ...sentryConfig,
      integrations: [new Sentry.Integrations.Http({ tracing: true })],
    });
    return this;
  }

  private throwErrorIfRunning() {
    try {
      if (this._isRunning) throw new Error('Cannot set up the app after Run');
    } catch (error) {
      this._app.get(Logger).error(error);
    }
  }
}

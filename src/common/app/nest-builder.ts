import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json } from 'express';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import * as Sentry from '@sentry/node';

import { defaultValidationPipeOptions } from '../constant';
import { CorsConfig } from '../../config/cors';
import { Winston } from '../../config/winston';
import { SentryConfig } from '../../config/monitor';
import { EnvUtil } from '../util';

type SwaggerBuilder = (basePath: string, app: INestApplication) => void;

export class NestBuilder {
  private app: INestApplication;
  private configService: ConfigService;

  setApp(app: INestApplication): this {
    this.configService = app.get(ConfigService);
    this.app = app;
    return this;
  }

  async createNestApp(
    appModule: any,
    appName: string,
  ): Promise<INestApplication> {
    const app = await NestFactory.create<INestApplication>(appModule, {
      logger: WinstonModule.createLogger(
        EnvUtil.isProd()
          ? Winston.getProductionConfig(appName)
          : Winston.getDevelopmentConfig(appName),
      ),
    });
    this.app = app;
    this.configService = app.get(ConfigService);
    return app;
  }

  preInitServer(options: { globalPrifix: string }): this {
    const customPatten =
      '[:date] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms';
    const { origin, ...other } = this.configService.get<CorsConfig>('cors');

    this.app.enableCors({
      ...other,
      origin: typeof origin === 'string' ? origin.split(',') : origin,
    });
    this.app.use(json({ limit: '50mb' }));
    this.app.use(morgan(customPatten));
    this.app.use(helmet());
    this.app.setGlobalPrefix(options.globalPrifix); // Note: Swagger 빌드전에 적용해야 docs에 적용된다.
    return this;
  }

  setDocs(builder: SwaggerBuilder, options: { basePatch: string }): this {
    builder(options.basePatch, this.app);
    return this;
  }

  initSentry(): this {
    const sentryConfig = this.configService.get<SentryConfig>('sentry');
    Sentry.init({
      ...sentryConfig,
      integrations: [new Sentry.Integrations.Http({ tracing: true })],
    });
    return this;
  }

  async initServer(): Promise<INestApplication> {
    await this.app //
      .useGlobalPipes(new ValidationPipe(defaultValidationPipeOptions))
      .listen(this.configService.get('port'));

    return this.app;
  }
}

import { EnvUtil, NestBuilder, WinstonUtil, buildSwagger } from '@app/common';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const winstonOption = WinstonUtil.getConfig({
    env: process.env.NODE_ENV,
    appName: process.env.APP_NAME,
  });

  const builder = await NestBuilder.createApp({
    appModule: AppModule,
    logger: WinstonModule.createLogger(winstonOption),
  });

  return EnvUtil.isProd()
    ? await builder //
        .setMiddleware({ globalPrefix: '/api', httpLogging: false })
        .setSecurity()
        .initSentry()
        .runServer()
    : await builder
        .setMiddleware({ globalPrefix: '/api', httpLogging: true })
        .setSwagger(buildSwagger, { docsPath: '/docs' })
        .setSecurity()
        .runServer();
}

bootstrap();

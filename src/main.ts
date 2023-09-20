import { NestBuilder, DefalutAppName } from '@app/common';
import { AppModule } from './app.module';
import { swaggerbuilder } from './swagger';

async function bootstrap() {
  const builder = new NestBuilder();
  const AppName = process.env.APP_NAME ?? DefalutAppName;
  await builder.createNestApp(AppModule, AppName);

  return process.env.NODE_ENV === 'production'
    ? await builder //
        .preInitServer({ globalPrifix: '/api' })
        .initSentry()
        .initServer()
    : await builder
        .preInitServer({ globalPrifix: '/api' })
        .setDocs(swaggerbuilder, { basePatch: '/docs' })
        .initServer();
}

bootstrap();

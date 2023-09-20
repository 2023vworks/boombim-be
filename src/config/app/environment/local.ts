import { DefalutAppName } from '@app/common';
import { AppConfig } from '../app.config';

export const LocalConfig: AppConfig = {
  appName: process.env.APP_NAME ?? DefalutAppName,
  port: +(process.env.PORT ?? 3000),
  cors: { origin: process.env.CORS_ORIGIN ?? '*' },

  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST, // 개발
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    logging: process.env.DATABASE_LOG as any,
    entities: [`${__dirname}/../../../entity/**/*.entity{.ts,.js}`],
    migrations: [`${__dirname}/**/migrations/**/*{.ts,.js}`],
    dropSchema: false,
    synchronize: false,
    ssl: false,
    migrationsTableName: 'migrations',
    migrationsRun: false,

    /* DB 가용성에 따라 변경 해야한다. */
    maxQueryExecutionTime:
      +process.env.DATABASE_MAX_QUERY_EXECUTION_TIME ?? 10000, // 10초
    extra: {
      statement_timeout: +process.env.DATABASE_CONNECT_TIMEOUT ?? 60000, // 1분
      min: +process.env.DATABASE_POOL_MIN_SIZE ?? 5,
      max: +process.env.DATABASE_POOL_MAX_SIZE ?? 10,
    },
  },

  swagger: {
    apis: {
      info: {
        title: process.env.SWAGGER_APIS_TITLE ?? DefalutAppName,
        description: process.env.SWAGGER_APIS_DESCRIPTION ?? DefalutAppName,
        version: process.env.SWAGGER_APIS_VERSION,
      },
      securityConfig: {
        name: 'Access-Token',
        securityOptions: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Access JWT',
          description: 'Enter Access Token',
          in: 'header',
        },
      },
    },
  },

  sentry: {
    dsn: process.env.SENTRY_DSN,
    // tracesSampleRate: +(process.env.TRACES_SAMPLE_RATE ?? 1),
    tracesSampleRate: +process.env.TRACES_SAMPLE_RATE,
  },
  slack: {
    serverErrorAlert: {
      webHooklUrl: process.env.SLACK_WEB_HOOK_URI_BY_SERVER_ERROR_ALERT,
      channelName: process.env.SLACK_CHANNEL_NAME_BY_SERVER_ERROR_ALERT,
      description: process.env.SLACK_DESCRIPTION_BY_SERVER_ERROR_ALERT,
      viewerUrl: process.env.SLACK_VIEWER_URL_BY_SERVER_ERROR_ALERT,
    },
  },
};

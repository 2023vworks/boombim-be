import { DefalutAppName, USER_ACCESS_TOKEN } from '@app/common';
import { AppConfig } from '../app.config';

export const LocalConfig: AppConfig = {
  appName: process.env.APP_NAME ?? DefalutAppName,
  port: +(process.env.PORT ?? 3000),
  cors: { origin: process.env.CORS_ORIGIN ?? '*' },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    issuer: process.env.JWT_ISSUER,
    subject: process.env.JWT_SUBJECT,
  },

  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
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
      +process.env.DATABASE_MAX_QUERY_EXECUTION_TIME ?? 10000,
    extra: {
      statement_timeout: +process.env.DATABASE_CONNECT_TIMEOUT ?? 60000,
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
        name: USER_ACCESS_TOKEN,
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

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { DatabaseConfig } from '@app/config';
import { CustomLoggerModule, CustomLoggerService } from '@app/custom';
import { DataSourceOptions } from 'typeorm';
import { CustomNamingStrategy } from './custom-naming-strategy';
import { DatabaseLogger } from './database-logger';

function createConnectionOptions(
  config: ConfigService,
  logger: CustomLoggerService,
): DataSourceOptions {
  const options = config.get<DatabaseConfig>('database');
  return {
    ...options,
    // TODO: DatabaseLogger는 CustomLogger를 의존하기 때문에 CustomLoggerModule이 로드된 이후 생성해야 한다.
    logger: new DatabaseLogger(logger),
    // TODO: CustomNamingStrategy는 Typorm의 DefaultNamingStrategy를 상속한다. 때문에 모듈 로드 시점에 생성해야 한다.
    namingStrategy: new CustomNamingStrategy(),
  };
}

export function getTypeOrmModuleAsyncOptions(): TypeOrmModuleAsyncOptions {
  return {
    imports: [ConfigModule, CustomLoggerModule],
    inject: [ConfigService, CustomLoggerService],
    useFactory: (config: ConfigService, logger: CustomLoggerService) =>
      createConnectionOptions(config, logger),
  };
}

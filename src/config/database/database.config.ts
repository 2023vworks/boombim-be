import { EntitySchema, LoggerOptions, MixedList } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { IsArray, IsNotEmpty } from 'class-validator';
import { PoolConfig } from 'pg';

import {
  BooleanValidator,
  InstanceValidator,
  IntValidator,
  StringValidator,
} from '@app/common';

class PoolOptions implements PoolConfig {
  @IntValidator()
  readonly statement_timeout: number; // 쿼리 강제 취소 시간(ms), ex) 60000 = 1분 이상 쿼리 강제 취소

  @IntValidator()
  readonly min: number; // 최소 커넥션, ex) 5 = 커넥션 풀에 최소 5개 커넥션 유지

  @IntValidator()
  readonly max: number; // 최대 커넥션(기본 10개), ex) 30 = 커넥션 풀에 최대 30개 커넥션 유지
}

export class DatabaseConfig implements PostgresConnectionOptions {
  @StringValidator()
  readonly type = 'postgres' as const;

  @StringValidator()
  readonly host: string;

  @IntValidator()
  readonly port: number = 5432;

  @StringValidator()
  readonly username: string;

  @StringValidator()
  readonly password: string;

  @StringValidator()
  readonly database: string;

  @BooleanValidator()
  readonly ssl = false;

  @IsNotEmpty()
  @IsArray()
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly entities: MixedList<Function | string | EntitySchema> = [
    `${__dirname}/../**/*.entity{.ts,.js}`,
  ];

  @StringValidator({}, { each: true })
  readonly migrations: string[] = [`${__dirname}/../migrations/**/*{.ts,.js}`];

  @BooleanValidator()
  readonly synchronize: boolean = false;

  @BooleanValidator()
  readonly dropSchema: boolean = false;

  @BooleanValidator()
  readonly migrationsRun: boolean = false;

  @StringValidator()
  readonly migrationsTableName = 'migrations';

  @IsNotEmpty()
  readonly logging: LoggerOptions = 'all';

  @IntValidator()
  readonly maxQueryExecutionTime: number; // 지연 로그 출력 시간(ms), ex) 10000 = 10초 이상 쿼리 로그 출력

  @InstanceValidator(PoolOptions)
  readonly extra: PoolOptions;
}

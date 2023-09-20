import { InstanceValidator, IntValidator, StringValidator } from '@app/common';
import {
  CorsConfig,
  DatabaseConfig,
  SentryConfig,
  SlackConfig,
  SwaggerConfig,
} from '@app/config';
import { BaseConfig } from './base.config';

export class AppConfig extends BaseConfig {
  @StringValidator()
  readonly appName: string;

  @IntValidator()
  readonly port: number;

  @InstanceValidator(CorsConfig)
  readonly cors: CorsConfig;

  @InstanceValidator(DatabaseConfig)
  readonly database: DatabaseConfig;

  @InstanceValidator(SwaggerConfig)
  readonly swagger: SwaggerConfig;

  @InstanceValidator(SentryConfig)
  readonly sentry: SentryConfig;

  @InstanceValidator(SlackConfig)
  readonly slack: SlackConfig;
}

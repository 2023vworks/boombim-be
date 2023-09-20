import { NumberValidator, StringValidator } from '@app/common';
import { NodeOptions } from '@sentry/node';

export class SentryConfig implements NodeOptions {
  @StringValidator()
  readonly dsn: string;

  @NumberValidator()
  readonly tracesSampleRate: number;
}

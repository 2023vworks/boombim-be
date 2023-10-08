import { StringValidator } from '@app/common';

export class AwsConfig {
  @StringValidator()
  readonly accessKey: string;

  @StringValidator()
  readonly secretAccess: string;

  @StringValidator()
  readonly region: string;
}

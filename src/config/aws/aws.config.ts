import { StringValidator } from '@app/common';

export class AwsConfig {
  @StringValidator()
  readonly accessKey: string;

  @StringValidator()
  readonly secret: string;

  @StringValidator()
  readonly region: string;

  @StringValidator()
  readonly bucketName: string;
}

import {
  InstanceValidator,
  StringValidatorOptional,
  StringValidator,
} from '@app/common';

export class SlackAlertOptions {
  @StringValidator()
  readonly webHooklUrl: string;

  @StringValidatorOptional()
  readonly channelName?: string | null;

  @StringValidatorOptional()
  readonly description?: string | null;

  @StringValidatorOptional()
  readonly viewerUrl?: string | null;
}

export class SlackConfig {
  @InstanceValidator(SlackAlertOptions)
  readonly serverErrorAlert: SlackAlertOptions;
}

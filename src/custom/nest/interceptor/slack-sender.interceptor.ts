import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncomingWebhook } from '@slack/client';
import { Request } from 'express';
import { tap } from 'rxjs/operators';

import { SlackTemplate, Util } from '@app/common';
import { SlackConfig } from '@app/config';
import { CustomLoggerService } from '../module';

@Injectable()
export class SlackSenderInterceptor implements NestInterceptor {
  private readonly webhook: IncomingWebhook;

  constructor(
    private readonly config: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {
    const { serverErrorAlert } = this.config.get<SlackConfig>('slack');
    this.webhook = new IncomingWebhook(serverErrorAlert.webHooklUrl);
    this.logger.setTarget('SlackSenderInterceptor');
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = this.removeSensitiveProperties(
      context.switchToHttp().getRequest(),
    );

    return next.handle().pipe(
      tap({
        error: (err) =>
          Util.isServerError(err) && this.sendMessage(err, request),
      }),
    );
  }

  private async sendMessage(error: Error, request: Request): Promise<void> {
    const { serverErrorAlert } = this.config.get<SlackConfig>('slack');
    const appName: string = this.config.get('appName');

    const message = SlackTemplate.errorTemplate({
      error,
      request,
      header: `${appName}-API-Server 버그 발생`,
      type: 'Error',
      trigger: 'SlackInterceptor',
      viewer: {
        viewerUrl: serverErrorAlert.viewerUrl,
        viewerText: 'Sentry에서 확인',
      },
    });
    await this.webhook
      .send(message) //
      .catch((error) => this.logger.error(error));
  }

  private removeSensitiveProperties(request: Request): Request {
    const body = { ...request.body };
    delete body.password;
    return { ...request, body } as Request;
  }
}

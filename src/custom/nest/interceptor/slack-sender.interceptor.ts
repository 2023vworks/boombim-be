import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncomingWebhook } from '@slack/client';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

import { SlackConfig } from '@app/config';
import { SlackTemplate, Util } from '@app/common';

@Injectable()
export class SlackSenderInterceptor implements NestInterceptor {
  private readonly webhook: IncomingWebhook;

  constructor(private readonly config: ConfigService) {
    const { serverErrorAlert } = this.config.get<SlackConfig>('slack');
    this.webhook = new IncomingWebhook(serverErrorAlert.webHooklUrl);
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

  private sendMessage(error: Error, request: Request) {
    const { serverErrorAlert } = this.config.get<SlackConfig>('slack');
    const appName: string = this.config.get('appName');

    const message = SlackTemplate.errorTemplate({
      error,
      request,
      appType: this.config.get('appType'),
      header: `${appName}-API-Server 버그 발생`,
      type: 'Error',
      trigger: 'SlackInterceptor',
      viewer: {
        viewerUrl: serverErrorAlert.viewerUrl,
        viewerText: 'Sentry에서 확인',
      },
    });
    return this.webhook.send(message);
  }

  private removeSensitiveProperties(request: Request): Request {
    const body = { ...request.body };
    delete body.password;
    return { ...request, body } as Request;
  }
}

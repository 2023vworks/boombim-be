import { IncomingWebhookSendArguments, MessageAttachment } from '@slack/client';
import { Request } from 'express';

import { DateUtil } from '../date-util';

type Viewer = {
  /**
   * 모니터링을 위해 연결할 플랫폼 Url ex)sentry, aws
   */
  viewerUrl: string;
  /**
   * 플랫폼 연결 링크 a태그의 text 속성
   */
  viewerText: string;
};
type MessageOptions = {
  /**
   * 서버 이름
   */
  appType: 'Admin' | 'User';
  /**
   * 메시지 헤더
   */
  header: string;
  /**
   * 메시지 타입
   */
  type: 'Alert' | 'Error';
  /**
   * 메세지 발행 주체 ex)className
   */
  trigger: string;

  /**
   * 모니터링 플렛폼 정보
   */
  viewer?: Viewer;
};
type AlertMessageOptions = MessageOptions & {
  type: 'Alert';
};
type ErrorMessageOptions = MessageOptions & {
  type: 'Error';
  error: Error;
  request?: Request;
};

export class SlackTemplate {
  public static alertTemplate(
    options: AlertMessageOptions,
  ): IncomingWebhookSendArguments {
    const { viewer } = options;
    const defaultAttachment = this.makeDefaultAttachment(options);
    const viewerAttachment = this.makeViewerAttachment(viewer);
    return {
      attachments: [defaultAttachment, viewerAttachment],
    };
  }

  public static errorTemplate(
    options: ErrorMessageOptions,
  ): IncomingWebhookSendArguments {
    const { error, viewer, request } = options;
    const { method, url, body } = request;
    const defaultAttachment = this.makeDefaultAttachment(options);
    const viewerAttachment = this.makeViewerAttachment(viewer);
    return {
      attachments: [
        defaultAttachment,
        {
          color: 'danger',
          fields: [
            {
              title: `*Error Message*: ${error.message}`,
              value: '```' + error.stack + '```',
              short: false,
            },
            {
              title: `*Error Request*: ${method} ${decodeURI(url)}`,
              value: '```' + JSON.stringify(body) + '```',
              short: false,
            },
          ],
        },
        viewerAttachment,
      ],
    };
  }

  private static makeDefaultAttachment(
    options: AlertMessageOptions | ErrorMessageOptions,
  ): MessageAttachment {
    return {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `[ ${options.appType} ] ${options.header}`,
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Type:*\n${options.type}`,
            },
            {
              type: 'mrkdwn',
              text: `*Created by:*\n${options.appType}-daldal-api-server`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Created:*\n${DateUtil.toFormat(new Date())}`,
            },
            {
              type: 'mrkdwn',
              text: `*trigger:*\n${options.trigger}`,
            },
          ],
        },
      ],
    };
  }
  private static makeViewerAttachment(viewer: Viewer): MessageAttachment {
    return {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<${viewer.viewerUrl}| 🔍 ${viewer.viewerText}>`,
          },
        },
      ],
    };
  }
}

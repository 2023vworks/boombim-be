import { IncomingWebhookSendArguments, MessageAttachment } from '@slack/client';
import { Request } from 'express';

import { DateUtil } from '../date-util';
import { DEFALUT_APP_NAME } from '@app/common/constant';

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
   * 메시지 헤더
   */
  header: string;
  /**
   * 메시지 타입
   */
  type: 'Alert' | 'Error' | 'Report';
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
type ReportAlertMessageOptions = MessageOptions & {
  type: 'Report';
  feed: { id: number; content: string; reportCount: number };
  reason: string;
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

  public static reportAlertTemplate(
    options: ReportAlertMessageOptions,
  ): IncomingWebhookSendArguments {
    const { viewer, feed, reason } = options;
    const defaultAttachment = this.makeDefaultAttachment(options);
    const viewerAttachment = this.makeViewerAttachment({
      ...viewer,
      viewerUrl: `${viewer.viewerUrl}/${feed.id}`,
    });
    return {
      attachments: [
        defaultAttachment,
        {
          color: 'good',
          fields: [
            {
              title: `*피드 정보*:`,
              value:
                '```' +
                `- 피드 id: ${feed.id}\n- 피드 내용: ${feed.content}\n- 누적 신고 횟수: ${feed.reportCount}` +
                '```',
              short: false,
            },
            {
              title: `*신고 내용*:`,
              value: '```' + reason + '```',
              short: false,
            },
          ],
        },
        ,
        viewerAttachment,
      ],
    };
  }

  private static makeDefaultAttachment(
    options: MessageOptions,
  ): MessageAttachment {
    return {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `[ ${process.env.NODE_ENV ?? 'local'} ] ${options.header}`,
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
              text: `*Created by:*\n${DEFALUT_APP_NAME.toLowerCase()}-api-server`,
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

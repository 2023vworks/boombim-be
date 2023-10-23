import { Request } from 'express';
import { IncomingWebhookSendArguments } from '@slack/webhook';
import type { Block, KnownBlock } from '@slack/types';

import { DEFALUT_APP_NAME } from '@app/common/constant';
import { DateUtil } from '../date-util';
import { SlackActionType } from './slack-action-type.enum';

type SlackBlock = KnownBlock | Block;

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
    const defaultBlocks = this.makeDefaultBlocks(options);
    return {
      blocks: [...defaultBlocks],
    };
  }

  public static errorTemplate(
    options: ErrorMessageOptions,
  ): IncomingWebhookSendArguments {
    const { error, request } = options;
    const { method, url, body } = request;
    const defaultBlocks = this.makeDefaultBlocks(options);
    return {
      blocks: [...defaultBlocks],
      attachments: [
        {
          color: 'danger',
          fields: [
            {
              title: `*Error Message*: ${error.message}`,
              value: '',
            },
            {
              title: ``,
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
      ],
    };
  }

  public static reportAlertTemplate(
    options: ReportAlertMessageOptions,
  ): IncomingWebhookSendArguments {
    const { viewer, feed, reason } = options;
    const defaultBlocks = this.makeDefaultBlocks({
      ...options,
      viewer: {
        ...viewer,
        viewerUrl: `${viewer.viewerUrl}/${feed.id}`,
      },
    });
    return {
      blocks: [...defaultBlocks],
      attachments: [
        {
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text:
                  `*신고 정보*:` +
                  '```' +
                  `- 피드 id: ${feed.id}\n- 피드 내용: ${feed.content}\n- 누적 신고 횟수: ${feed.reportCount}` +
                  '```',
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*신고 내용*:` + '```' + reason + '```',
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '피드를 비활성화 하고 싶다면 클릭하세요.',
              },
              accessory: {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '⚙️ 비활성화',
                  emoji: true,
                },
                value: `${feed.id}`, // 핸들링에서 받을 값
                action_id: `${SlackActionType.ACTION_FEED_REPORT}`, // 핸들링할 id
              },
            },
          ],
        },
      ],
    };
  }

  private static makeDefaultBlocks(options: MessageOptions): SlackBlock[] {
    const { viewer } = options;
    return [
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
            text: `*Type:*\n- ${options.type}`,
          },
          {
            type: 'mrkdwn',
            text: `*Trigger:*\n- ${options.trigger}`,
          },
          {
            type: 'mrkdwn',
            text: `*Created:*\n- ${DateUtil.toFormat(new Date())}`,
          },
          {
            type: 'mrkdwn',
            text: viewer
              ? `*Viewer:*\n- <${viewer.viewerUrl}|${viewer.viewerText}>`
              : `*Created by:*\n- ${DEFALUT_APP_NAME.toLowerCase()}-api-server`,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `\n`,
          },
        ],
      },
    ];
  }
  private static makeViewerBlock(viewer: Viewer): SlackBlock {
    return {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `<${viewer.viewerUrl}| 🔍 ${viewer.viewerText}>`,
      },
    };
  }
}

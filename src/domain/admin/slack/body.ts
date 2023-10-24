export const mockBody = {
  payload: {
    type: 'block_actions',
    user: {
      id: 'U062XT9S6JC',
      username: '1994dbwogus',
      name: '1994dbwogus',
      team_id: 'T062MGW5LU9',
    },
    api_app_id: 'A06228SQZM4',
    token: 'uOJGKfomH5M60VJ4Jiu9DyU6',
    container: {
      type: 'message_attachment',
      message_ts: '1697999103.535879',
      attachment_id: 1,
      channel_id: 'C061UBSUPV5',
      is_ephemeral: false,
      is_app_unfurl: false,
    },
    trigger_id: '6076978296370.6089574190961.917aba2fac2dc15b22d5f631cca728cf',
    team: { id: 'T062MGW5LU9', domain: 'jay-playgroundhq' },
    enterprise: null,
    is_enterprise_install: false,
    channel: { id: 'C061UBSUPV5', name: 'test' },
    message: {
      type: 'message',
      subtype: 'bot_message',
      text: '[ production ] \\ud53c\\ub4dc \\uc2e0\\uace0 \\uc54c\\ub9bc *Type:*\\n- Report *Trigger:*\\n- FeedService *Created:*\\n- 2023-10-23 03:25:03.307 *Viewer:*\\n- <https:\\/\\/boomb.im\\/admin\\/feeds\\/5|\\ud53c\\ub4dc \\uc2e0\\uace0 \\ub0b4\\uc5ed \\ud655\\uc778> \\n',
      ts: '1697999103.535879',
      bot_id: 'B062XUH461W',
      blocks: [
        {
          type: 'header',
          block_id: 'RyEuV',
          text: {
            type: 'plain_text',
            text: '[ production ] \\ud53c\\ub4dc \\uc2e0\\uace0 \\uc54c\\ub9bc',
            emoji: true,
          },
        },
        {
          type: 'section',
          block_id: 'QBoTi',
          fields: [
            { type: 'mrkdwn', text: '*Type:*\\n- Report', verbatim: false },
            {
              type: 'mrkdwn',
              text: '*Trigger:*\\n- FeedService',
              verbatim: false,
            },
            {
              type: 'mrkdwn',
              text: '*Created:*\\n- 2023-10-23 03:25:03.307',
              verbatim: false,
            },
            {
              type: 'mrkdwn',
              text: '*Viewer:*\\n- <https:\\/\\/boomb.im\\/admin\\/feeds\\/5|\\ud53c\\ub4dc \\uc2e0\\uace0 \\ub0b4\\uc5ed \\ud655\\uc778>',
              verbatim: false,
            },
          ],
        },
        {
          type: 'section',
          block_id: 'zwCpk',
          fields: [{ type: 'mrkdwn', text: '\\n', verbatim: false }],
        },
      ],
      attachments: [
        {
          id: 1,
          blocks: [
            {
              type: 'section',
              block_id: 'VwSuk',
              text: {
                type: 'mrkdwn',
                text: '*\\uc2e0\\uace0 \\uc815\\ubcf4*:```- \\ud53c\\ub4dc id: 5\\n- \\ud53c\\ub4dc \\ub0b4\\uc6a9: \\ud14c\\uc2a4\\ud2b89\\n- \\ub204\\uc801 \\uc2e0\\uace0 \\ud69f\\uc218: 5```',
                verbatim: false,
              },
            },
            {
              type: 'section',
              block_id: 'VYuWs',
              text: {
                type: 'mrkdwn',
                text: '*\\uc2e0\\uace0 \\ub0b4\\uc6a9*:```\\ud14c\\uc2a4\\ud2b8\\ud14c\\uc2a4\\ud2b8\\ud14c\\uc2a4\\ud2b85```',
                verbatim: false,
              },
            },
            {
              type: 'section',
              block_id: 'H8mzh',
              text: {
                type: 'mrkdwn',
                text: '\\ud53c\\ub4dc\\ub97c \\ube44\\ud65c\\uc131\\ud654 \\ud558\\uace0 \\uc2f6\\ub2e4\\uba74 \\ud074\\ub9ad\\ud558\\uc138\\uc694.',
                verbatim: false,
              },
              accessory: {
                type: 'button',
                action_id: 'action_feed_report',
                text: {
                  type: 'plain_text',
                  text: ':gear: \\ube44\\ud65c\\uc131\\ud654',
                  emoji: true,
                },
                value: 'action_feed_report_1',
              },
            },
          ],
          fallback: '[no preview available]',
        },
      ],
    },
    state: { values: {} },
    response_url:
      'https:\\/\\/hooks.slack.com\\/actions\\/T062MGW5LU9\\/6099972277920\\/X7J5GLTnilPRDdiqUokmo0m6',
    actions: [
      {
        action_id: 'action_feed_report',
        block_id: 'H8mzh',
        text: {
          type: 'plain_text',
          text: ':gear: \\ube44\\ud65c\\uc131\\ud654',
          emoji: true,
        },
        value: 'action_feed_report_1',
        type: 'button',
        action_ts: '1697999106.542419',
      },
    ],
  },
};

console.log(mockBody.payload.actions);
console.log(mockBody.payload.actions[0].value);

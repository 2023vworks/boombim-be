import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiControllerDocument,
  DEFALUT_APP_NAME,
  SlackActionType,
  errorMessage,
} from '@app/common';
import { FeedService, FeedServiceToken } from '../feed/feed.service';
import { DocumentHelper } from './document';

@ApiControllerDocument(`[${DEFALUT_APP_NAME}] Admin - slack API`)
@Controller('/admin/slack')
@UseInterceptors(ClassSerializerInterceptor)
export class SlackController {
  constructor(
    @Inject(FeedServiceToken)
    private readonly feedService: FeedService,
  ) {}

  @DocumentHelper('postAction')
  @Post('/action')
  @HttpCode(200) // TODO: slack api는 200을 반환해야 한다.
  async postAction(@Body() body: any): Promise<any> {
    const payload = JSON.parse(body?.payload);
    const actionId: SlackActionType = payload?.actions.at(0)?.action_id;
    const value: number = parseInt(payload?.actions.at(0)?.value);

    if (!actionId) throw new BadRequestException(errorMessage.E400_SLACK_001);
    if (!value || Number.isNaN(value))
      throw new BadRequestException(errorMessage.E400_SLACK_003);

    switch (actionId) {
      case SlackActionType.ACTION_FEED_REPORT:
        await this.feedService.expireFeed(value);
        break;
      default:
        throw new BadRequestException(errorMessage.E400_SLACK_002);
    }
  }
}

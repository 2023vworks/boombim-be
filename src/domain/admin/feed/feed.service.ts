import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Util, errorMessage, successMessage } from '@app/common';
import { SlackAlertOptions, SlackConfig } from '@app/config';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { IncomingWebhook } from '@slack/webhook';
import { DataSource } from 'typeorm';
import {
  AdminGetFeedResponseDTO,
  AdminGetFeedsRequestDTO,
  AdminGetFeedsWithCountResponseDTO,
  AdminPatchFeedActivationRequestDTO,
} from './dto';
import { FeedRepository, FeedRepositoryToken } from './feed.repository';

export const FeedServiceToken = Symbol('FeedServiceToken');
export interface FeedService {
  getFeeds(
    getDto: AdminGetFeedsRequestDTO,
  ): Promise<AdminGetFeedsWithCountResponseDTO>;
  getFeed(feedId: number): Promise<AdminGetFeedResponseDTO>;

  patchFeedActivation(
    feedId: number,
    patchDto: AdminPatchFeedActivationRequestDTO,
  ): Promise<void>;

  expireFeed(feedId: number): Promise<void>;
}

@Injectable()
export class FeedServiceImpl implements FeedService {
  private readonly reportAlartConfig: SlackAlertOptions;
  private readonly webhook: IncomingWebhook;

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(FeedRepositoryToken) private readonly feedRepo: FeedRepository,
    config: ConfigService,
  ) {
    this.reportAlartConfig = config.get<SlackConfig>('slack').feedReportAlert;
    this.webhook = new IncomingWebhook(this.reportAlartConfig.webHooklUrl);
  }

  async getFeeds(
    getDto: AdminGetFeedsRequestDTO,
  ): Promise<AdminGetFeedsWithCountResponseDTO> {
    const result = await this.feedRepo.findMany(getDto);
    return Util.toInstance(AdminGetFeedsWithCountResponseDTO, result);
  }

  async getFeed(feedId: number): Promise<AdminGetFeedResponseDTO> {
    const feed = await this.feedRepo.findOneByPK(feedId);
    if (!feed) throw new NotFoundException(errorMessage.E404_FEED_001);
    return Util.toInstance(AdminGetFeedResponseDTO, feed);
  }

  async patchFeedActivation(
    feedId: number,
    patchDto: AdminPatchFeedActivationRequestDTO,
  ): Promise<void> {
    const isExist = await this.feedRepo.exist({ where: { id: feedId } });
    if (!isExist) throw new NotFoundException(errorMessage.E404_FEED_001);

    await this.feedRepo.updateProperty(feedId, {
      activationAt: patchDto.activationAt,
      activity: patchDto.activity,
    });
  }

  async expireFeed(feedId: number): Promise<void> {
    const feed = await this.feedRepo.findOneByPK(feedId);
    if (!feed) {
      await this.webhook.send(`${feedId}번 ${errorMessage.E404_FEED_001}`);
      throw new NotFoundException(errorMessage.E404_FEED_001);
    }
    if (feed.isActivated) {
      await this.webhook.send(`${feedId} ${errorMessage.E409_ADMIN_FEED_001}`);
      throw new NotFoundException(errorMessage.E409_ADMIN_FEED_001);
    }

    await this.feedRepo.updateProperty(feedId, { activationAt: new Date() });
    await this.webhook.send(`${feedId}번 ${successMessage.S200_SLACK_001}`);
  }
}

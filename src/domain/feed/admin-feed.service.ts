import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { SlackAlertOptions, SlackConfig } from '@app/config';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { IncomingWebhook } from '@slack/client';
import { DataSource } from 'typeorm';
import {
  AdminGetFeedsRequestDTO,
  AdminGetFeedsResponseDTO,
  AdminPatchFeedActivationRequestDTO,
} from './dto';
import { FeedRepository, FeedRepositoryToken } from './feed.repository';
import { Util, errorMessage } from '@app/common';

export const AdminFeedServiceToken = Symbol('AdminFeedServiceToken');
export interface AdminFeedService {
  getFeeds(
    getDto: AdminGetFeedsRequestDTO,
  ): Promise<AdminGetFeedsResponseDTO[]>;

  patchFeedActivation(
    feedId: number,
    patchDto: AdminPatchFeedActivationRequestDTO,
  ): Promise<void>;
}

@Injectable()
export class AdminFeedServiceImpl implements AdminFeedService {
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
  ): Promise<AdminGetFeedsResponseDTO[]> {
    const feeds = await this.feedRepo.findMany(getDto);
    return Util.toInstance(AdminGetFeedsResponseDTO, feeds);
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
}

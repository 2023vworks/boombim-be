import { Inject, Injectable } from '@nestjs/common';

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
import { Util } from '@app/common';

export const AdminFeedServiceToken = Symbol('AdminFeedServiceToken');
export interface AdminFeedService {
  getFeeds(
    getDto: AdminGetFeedsRequestDTO,
  ): Promise<AdminGetFeedsResponseDTO[]>;

  patchFeedActivation(
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
    patchDto: AdminPatchFeedActivationRequestDTO,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

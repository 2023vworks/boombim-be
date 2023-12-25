import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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
import { AdminFeedRepositoryPort } from './admin-feed.repository';

export abstract class AdminFeedServiceUseCase {
  abstract getFeeds(
    getDto: AdminGetFeedsRequestDTO,
  ): Promise<AdminGetFeedsWithCountResponseDTO>;
  abstract getFeed(feedId: number): Promise<AdminGetFeedResponseDTO>;

  abstract patchFeedActivation(
    feedId: number,
    patchDto: AdminPatchFeedActivationRequestDTO,
  ): Promise<void>;

  abstract expireFeed(feedId: number): Promise<void>;
}

@Injectable()
export class AdminFeedService extends AdminFeedServiceUseCase {
  private readonly reportAlartConfig: SlackAlertOptions;
  private readonly webhook: IncomingWebhook;

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly feedRepo: AdminFeedRepositoryPort,
    config: ConfigService,
  ) {
    super();
    this.reportAlartConfig = config.get<SlackConfig>('slack').feedReportAlert;
    this.webhook = new IncomingWebhook(this.reportAlartConfig.webHooklUrl);
  }

  override async getFeeds(
    getDto: AdminGetFeedsRequestDTO,
  ): Promise<AdminGetFeedsWithCountResponseDTO> {
    const result = await this.feedRepo.findMany(getDto);
    return Util.toInstance(AdminGetFeedsWithCountResponseDTO, result);
  }

  override async getFeed(feedId: number): Promise<AdminGetFeedResponseDTO> {
    const feed = await this.feedRepo.findOneByPK(feedId);
    if (!feed) throw new NotFoundException(errorMessage.E404_FEED_001);
    return Util.toInstance(AdminGetFeedResponseDTO, feed);
  }

  override async patchFeedActivation(
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

  override async expireFeed(feedId: number): Promise<void> {
    const feed = await this.feedRepo.findOneByPK(feedId);
    if (!feed) {
      await this.webhook.send(`${feedId}번 ${errorMessage.E404_FEED_001}`);
      throw new NotFoundException(errorMessage.E404_FEED_001);
    }
    if (!feed.isActivated) {
      await this.webhook.send(`${feedId} ${errorMessage.E409_ADMIN_FEED_001}`);
      throw new ConflictException(errorMessage.E409_ADMIN_FEED_001);
    }

    await this.feedRepo.updateProperty(feedId, { activationAt: new Date() });
    await this.webhook.send(`${feedId}번 ${successMessage.S200_SLACK_001}`);
  }
}

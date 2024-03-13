import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CustomLoggerService } from '@app/custom';
import { FeedServiceUseCase } from '../feed.service';
import { mockPostFeedsRequestDTO } from './mock/mock-feeds';

@Injectable()
export class FeedScheduler implements OnApplicationBootstrap {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly feedService: FeedServiceUseCase,
  ) {
    this.logger.setTarget(FeedScheduler.name);
  }

  /**
   * 스케줄러 예시
   * ```
   * `@Cron('* * * * * *')`
   *         | | | | | |
   *         | | | | | day of week
   *         | | | | months
   *         | | | day of month
   *         | | hours
   *         | minutes
   *         seconds
   * async handleCron() { }
   * ```
   * @see https://docs.nestjs.com/techniques/task-scheduling#declarative-cron-jobs
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  // @Cron(CronExpression.EVERY_SECOND)
  async handleCron() {
    this.logger.log(`Cron job start: 
      - "${CronExpression.EVERY_6_HOURS}"
      - Create Mock Feeds
    `);
    await this.feedService.createMockFeeds(mockPostFeedsRequestDTO);
  }

  async onApplicationBootstrap() {
    await this.feedService.createMockFeeds(mockPostFeedsRequestDTO);
  }
}

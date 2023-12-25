import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { IncomingWebhook } from '@slack/webhook';
import { DataSource } from 'typeorm';

import { SlackTemplate, Util, errorMessage } from '@app/common';
import { SlackAlertOptions, SlackConfig } from '@app/config';
import { RecommendType } from '@app/entity';
import { UserRepositoryPort } from '../user/user.repository';
import {
  GetFeedActivationTimeResponseDTO,
  GetFeedCommentsRequestDTO,
  GetFeedCommentsResponseDTO,
  GetFeedResponseDTO,
  GetFeedsRequestDTO,
  GetFeedsResponseDTO,
  PostFeedCommentRequestDTO,
  PostFeedCommentResponseDTO,
  PostFeedReportRequestDTO,
  PostFeedRequestDTO,
  PostFeedResponseDTO,
} from './dto';
import {
  CommentRepositoryPort,
  FeedRepositoryPort,
  RecommendHistoryRepositoryPort,
  ReportHistoryRepositoryPort,
  type PureFeed,
} from './repository';
import { UploadServiceUseCase } from './upload/upload.service';

export abstract class FeedServiceUseCase {
  abstract getFeeds(getDto: GetFeedsRequestDTO): Promise<GetFeedsResponseDTO[]>;
  abstract getFeedsByGeoMarkId(
    geoMarkId: number,
  ): Promise<GetFeedResponseDTO[]>;
  abstract createFeed(
    userId: number,
    postDto: PostFeedRequestDTO,
  ): Promise<PostFeedResponseDTO>;

  abstract createFeedImages(
    userId: number,
    feedId: number,
    file: Express.Multer.File[],
  ): Promise<void>;
  abstract getFeed(feedId: number): Promise<GetFeedResponseDTO>;
  abstract getFeedActivationTime(
    feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO>;

  abstract getComments(
    feedId: number,
    getDto: GetFeedCommentsRequestDTO,
  ): Promise<GetFeedCommentsResponseDTO[]>;
  abstract createComment(
    userId: number,
    feedId: number,
    postDto: PostFeedCommentRequestDTO,
  ): Promise<PostFeedCommentResponseDTO>;

  abstract feedRecommend(
    userId: number,
    feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO>;
  abstract feedUnrecommend(
    userId: number,
    feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO>;
  abstract feedReport(
    userId: number,
    feedId: number,
    postDto: PostFeedReportRequestDTO,
  ): Promise<void>;
}

@Injectable()
export class FeedService extends FeedServiceUseCase {
  private readonly reportAlartConfig: SlackAlertOptions;
  private readonly webhook: IncomingWebhook;

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly feedRepo: FeedRepositoryPort,
    private readonly userRepo: UserRepositoryPort,
    private readonly commentRepo: CommentRepositoryPort,
    private readonly recommnedRepo: RecommendHistoryRepositoryPort,
    private readonly reportRepo: ReportHistoryRepositoryPort,
    private readonly uploadService: UploadServiceUseCase,
    config: ConfigService,
  ) {
    super();
    this.reportAlartConfig = config.get<SlackConfig>('slack').feedReportAlert;
    this.webhook = new IncomingWebhook(this.reportAlartConfig.webHooklUrl);
  }

  async getFeeds(getDto: GetFeedsRequestDTO): Promise<GetFeedsResponseDTO[]> {
    const feeds = await this.feedRepo.findManyByPolygon(getDto);
    return Util.toInstance(GetFeedsResponseDTO, feeds);
  }

  async getFeedsByGeoMarkId(geoMarkId: number): Promise<GetFeedResponseDTO[]> {
    const feed = await this.feedRepo.findOneByGeoMarkId(geoMarkId);
    if (!feed) return [];
    const recommendHistories = await this.recommnedRepo.findManyByFeedId(
      feed.id,
    );

    await this.feedRepo.updateProperty(feed.id, {
      viewCount: feed.addViewCount().viewCount,
    });
    return Util.toInstance(GetFeedResponseDTO, [
      { ...feed.props, recommendHistories },
    ]);
  }

  async createFeed(
    userId: number,
    postDto: PostFeedRequestDTO,
  ): Promise<PostFeedResponseDTO> {
    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const txFeedRepo = this.feedRepo.createTransactionRepo(manager);
      const txUserRepo = this.userRepo.createTransactionRepo(manager);

      const { id } = await txFeedRepo.createOne(userId, postDto);
      const user = await txUserRepo.findOneByPK(userId);

      const isMaxFeedWritingCount = user.isMaxFeedWritingCount;
      const feedWritingCount = user.useWritingCount().feedWritingCount;
      const isRenewed = user.isRenewedFeedWritingCount;
      // Note: 피드 작성 횟수가 소모된 상태라면 이전에 셋팅된 갱신 시간을 수정해서는 안된다.
      const feedWritingCountRechargeStartAt = isMaxFeedWritingCount
        ? new Date()
        : isRenewed
        ? user.feedWritingCountRechargeStartAt
        : undefined;

      await txUserRepo.updateProperty(userId, {
        feedWritingCount,
        feedWritingCountRechargeStartAt,
      });

      await queryRunner.commitTransaction();
      return { feedId: id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createFeedImages(
    userId: number,
    feedId: number,
    file: Express.Multer.File[],
  ): Promise<void> {
    const feed = await this.feedRepo.existOneByUserId(feedId, userId);
    if (!feed) throw new NotFoundException(errorMessage.E404_FEED_001);
    const images = await this.uploadService.feedFilesUpload(
      userId,
      feedId,
      file,
    );
    await this.feedRepo.updateProperty(feedId, {
      thumbnailImages: images, // TODO: 리사이징 로직 추가시 제거
      images,
    });
  }

  async getFeed(feedId: number): Promise<GetFeedResponseDTO> {
    const feed = await this.feedRepo.findOneByPK(feedId);
    if (!feed) throw new NotFoundException(errorMessage.E404_FEED_001);
    const recommendHistories = await this.recommnedRepo.findManyByFeedId(
      feed.id,
    );

    await this.feedRepo.updateProperty(feedId, {
      viewCount: feed.addViewCount().viewCount,
    });
    return Util.toInstance(GetFeedResponseDTO, {
      ...feed.props,
      recommendHistories,
    });
  }

  async getFeedActivationTime(
    feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO> {
    const feed = await this.feedRepo.findOnePure(feedId);
    if (!feed) throw new NotFoundException(errorMessage.E404_FEED_001);

    return Util.toInstance(GetFeedActivationTimeResponseDTO, {
      activationAt: feed.activationAt,
      currentAt: new Date(),
    });
  }

  async getComments(
    feedId: number,
    getDto: GetFeedCommentsRequestDTO,
  ): Promise<GetFeedCommentsResponseDTO[]> {
    const feed = await this.feedRepo.findOnePure(feedId);
    if (!feed) throw new NotFoundException(errorMessage.E404_FEED_001);

    const comments = await this.commentRepo.findByFeedId(feedId, getDto);
    return Util.toInstance(GetFeedCommentsResponseDTO, comments);
  }

  async createComment(
    userId: number,
    feedId: number,
    postDto: PostFeedCommentRequestDTO,
  ): Promise<PostFeedCommentResponseDTO> {
    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const txFeedRepo = this.feedRepo.createTransactionRepo(manager);
      const txCommentRepo = this.commentRepo.createTransactionRepo(manager);

      const feed = await txFeedRepo.findOnePure(feedId);
      if (!feed) throw new NotFoundException(errorMessage.E404_FEED_001);

      const comment = await txCommentRepo.createOne(userId, feedId, postDto);
      await txFeedRepo.updateProperty(feedId, {
        commentCount: feed.addCommentCount().commentCount,
      });
      await queryRunner.commitTransaction();
      return { commentId: comment.id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async feedRecommend(
    userId: number,
    feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO> {
    return this.createRecommend(userId, feedId, RecommendType.RECOMMEND);
  }

  async feedUnrecommend(
    userId: number,
    feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO> {
    return this.createRecommend(userId, feedId, RecommendType.UNRECOMMEND);
  }

  async feedReport(
    userId: number,
    feedId: number,
    postDto: PostFeedReportRequestDTO,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const txFeedRepo = this.feedRepo.createTransactionRepo(manager);
      const txReportRepo = this.reportRepo.createTransactionRepo(manager);

      const feed = await txFeedRepo.findOnePure(feedId);
      if (!feed) throw new NotFoundException(errorMessage.E404_FEED_001);
      const isExist = await txReportRepo.existOne(userId, feedId);
      if (isExist) throw new ConflictException(errorMessage.E409_FEED_003);

      await txReportRepo.createOne(userId, feedId, postDto);
      await txFeedRepo.updateProperty(feedId, {
        reportCount: feed.addReportCount().reportCount,
      });

      feed.isLockFeed && (await this.feedReportAlert(feed, postDto.reason));
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async createRecommend(
    userId: number,
    feedId: number,
    type: RecommendType,
  ): Promise<GetFeedActivationTimeResponseDTO> {
    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const txFeedRepo = this.feedRepo.createTransactionRepo(manager);
      const txRecommendRepo = this.recommnedRepo.createTransactionRepo(manager);

      const feed = await txFeedRepo.findOnePure(feedId);
      if (!feed) throw new NotFoundException(errorMessage.E404_FEED_001);

      const isExist = await txRecommendRepo.existOne(userId, feedId, type);
      if (isExist) throw new ConflictException(errorMessage.E409_FEED_002);

      if (type === RecommendType.RECOMMEND) {
        feed.recommned();
        await txFeedRepo.updateProperty(feedId, {
          recommendCount: feed.recommendCount,
          activationAt: feed.activationAt,
          activity: feed.activity,
        });
      } else {
        feed.unrecommned();
        await txFeedRepo.updateProperty(feedId, {
          unrecommendCount: feed.unrecommendCount,
          activationAt: feed.activationAt,
        });
      }
      await txRecommendRepo.createOne(userId, feedId, type);

      await queryRunner.commitTransaction();
      return { activationAt: feed.activationAt, currentAt: new Date() };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async feedReportAlert(feed: PureFeed, reason: string) {
    const { viewerUrl } = this.reportAlartConfig;
    const message = SlackTemplate.reportAlertTemplate({
      header: '피드 신고 알림',
      type: 'Report',
      trigger: 'FeedService',
      viewer: {
        viewerUrl,
        viewerText: '피드 신고 내역 확인',
      },
      feed,
      reason,
    });
    await this.webhook.send(message);
  }
}

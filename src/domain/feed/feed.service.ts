import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Util, errorMessage } from '@app/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserRepository, UserRepositoryToken } from '../user/user.repository';
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
import { FeedRepository, FeedRepositoryToken } from './feed.repository';
import { RecommendType } from '@app/entity';

export const FeedServiceToken = Symbol('FeedServiceToken');
export interface FeedService {
  getFeeds(getDto: GetFeedsRequestDTO): Promise<GetFeedsResponseDTO[]>;
  getFeedsByGeoMarkId(geoMarkId: number): Promise<GetFeedResponseDTO[]>;
  createFeeds(
    userId: number,
    postDto: PostFeedRequestDTO,
  ): Promise<PostFeedResponseDTO>;

  createFeedImages(feedId: number, file: Express.Multer.File[]): Promise<void>;
  getFeed(feedId: number): Promise<GetFeedResponseDTO>;
  getFeedActivationTime(
    feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO>;

  getComments(
    feedId: number,
    getDto: GetFeedCommentsRequestDTO,
  ): Promise<GetFeedCommentsResponseDTO[]>;
  createComment(
    userId: number,
    feedId: number,
    postDto: PostFeedCommentRequestDTO,
  ): Promise<PostFeedCommentResponseDTO>;

  feedRecommend(
    userId: number,
    feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO>;
  feedUnrecommend(
    userId: number,
    feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO>;
  feedReport(
    userId: number,
    feedId: number,
    postDto: PostFeedReportRequestDTO,
  ): Promise<void>;
}

@Injectable()
export class FeedServiceImpl implements FeedService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(FeedRepositoryToken)
    private readonly feedRepo: FeedRepository,
    @Inject(UserRepositoryToken)
    private readonly userRepo: UserRepository,
  ) {}

  async getFeeds(getDto: GetFeedsRequestDTO): Promise<GetFeedsResponseDTO[]> {
    const feeds =
      getDto.testType === 'Polygon'
        ? await this.feedRepo.findByPolygon(getDto)
        : await this.feedRepo.findByCoordinates(getDto);
    return Util.toInstance(GetFeedsResponseDTO, feeds);
  }

  async getFeedsByGeoMarkId(geoMarkId: number): Promise<GetFeedResponseDTO[]> {
    const feed = await this.feedRepo.findOneByGeoMarkId(geoMarkId);
    if (!feed) return [];

    await this.feedRepo.updateProperty(feed.id, {
      viewCount: feed.addViewCount().viewCount,
    });
    return Util.toInstance(GetFeedResponseDTO, [feed]);
  }

  async createFeeds(
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

      const { id } = await txFeedRepo.createFeed(userId, postDto);
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
    feedId: number,
    file: Express.Multer.File[],
  ): Promise<void> {
    throw new NotFoundException('미구현 API');
  }

  async getFeed(feedId: number): Promise<GetFeedResponseDTO> {
    const feed = await this.feedRepo.findOneByPK(feedId);
    if (!feed) throw new NotFoundException(errorMessage.E404_FEED_001);

    await this.feedRepo.updateProperty(feedId, {
      viewCount: feed.addViewCount().viewCount,
    });
    return Util.toInstance(GetFeedResponseDTO, feed);
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

    const comments = await this.feedRepo.findCommentsByFeedId(feedId, getDto);
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
      const feed = await txFeedRepo.findOnePure(feedId);
      if (!feed) throw new NotFoundException(errorMessage.E404_FEED_001);

      const comment = await txFeedRepo.createComment(userId, feedId, postDto);
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
    const feed = await this.feedRepo.findOnePure(feedId);
    if (!feed) throw new NotFoundException(errorMessage.E404_FEED_001);

    await this.feedRepo.createReportHistory(userId, feedId, postDto);
    // TODO: 신고 횟수가 5회 이상이면 슬랙에 알림을 보내는 로직을 추가한다.
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
      const feed = await txFeedRepo.findOnePure(feedId);
      if (!feed) throw new NotFoundException(errorMessage.E404_FEED_001);

      const isExist = await txFeedRepo.existHistory(userId, feedId, type);
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
      await txFeedRepo.createRecommendHistory(userId, feedId, type);

      await queryRunner.commitTransaction();
      return { activationAt: feed.activationAt, currentAt: new Date() };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

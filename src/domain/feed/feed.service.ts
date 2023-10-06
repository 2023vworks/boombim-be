import { Inject, Injectable, NotFoundException } from '@nestjs/common';

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
  createComments(
    feedId: number,
    postDto: PostFeedCommentRequestDTO,
  ): Promise<PostFeedCommentResponseDTO>;

  feedRecommend(feedId: number): Promise<GetFeedActivationTimeResponseDTO>;
  feedUnrecommend(feedId: number): Promise<GetFeedActivationTimeResponseDTO>;
  feedReport(feedId: number, postDto: PostFeedReportRequestDTO): Promise<void>;
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
    // 유저 조회 -> 작성횟수 갱신 => 작성 여부 확인 => 차감

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
    throw new NotFoundException('미구현 API');
  }

  async getComments(
    feedId: number,
    getDto: GetFeedCommentsRequestDTO,
  ): Promise<GetFeedCommentsResponseDTO[]> {
    throw new NotFoundException('미구현 API');
  }

  async createComments(
    feedId: number,
    postDto: PostFeedCommentRequestDTO,
  ): Promise<PostFeedCommentResponseDTO> {
    throw new NotFoundException('미구현 API');
  }

  async feedRecommend(
    feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO> {
    throw new NotFoundException('미구현 API');
  }

  async feedUnrecommend(
    feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO> {
    throw new NotFoundException('미구현 API');
  }

  async feedReport(
    feedId: number,
    postDto: PostFeedReportRequestDTO,
  ): Promise<void> {
    throw new NotFoundException('미구현 API');
  }
}

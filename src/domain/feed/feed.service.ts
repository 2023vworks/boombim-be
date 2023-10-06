import { Inject, Injectable, NotFoundException } from '@nestjs/common';

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
import { Util, errorMessage } from '@app/common';

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
    @Inject(FeedRepositoryToken)
    private readonly feedRepo: FeedRepository,
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
    throw new NotFoundException('미구현 API');
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

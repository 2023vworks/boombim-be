import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  GetFeedCommentsRequestDTO,
  GetFeedCommentsResponseDTO,
  GetFeedResponseDTO,
  GetFeedsRequestDTO,
  GetFeedsResponseDTO,
  GetFeedsSearchRequestDTO,
  PostFeedCommentRequestDTO,
  PostFeedCommentResponseDTO,
  PostFeedReportRequestDTO,
  PostFeedRequestDTO,
  PostFeedResponseDTO,
} from './dto';
import { FeedRepository, FeedRepositoryToken } from './feed.repository';
import { Util } from '@app/common';

export const FeedServiceToken = Symbol('FeedServiceToken');
export interface FeedService {
  getFeeds(getDto: GetFeedsRequestDTO): Promise<GetFeedsResponseDTO[]>;
  postFeeds(
    userId: number,
    postDto: PostFeedRequestDTO,
  ): Promise<PostFeedResponseDTO>;
  postImages(feedId: number, file: Express.Multer.File[]): Promise<void>;
  getFeed(feedId: number): Promise<GetFeedResponseDTO>;
  getSearch(getDto: GetFeedsSearchRequestDTO): Promise<GetFeedResponseDTO[]>;

  getComments(
    feedId: number,
    getDto: GetFeedCommentsRequestDTO,
  ): Promise<GetFeedCommentsResponseDTO[]>;
  postComments(
    feedId: number,
    postDto: PostFeedCommentRequestDTO,
  ): Promise<PostFeedCommentResponseDTO>;

  postRecommend(feedId: number): Promise<void>;
  postUnrecommend(feedId: number): Promise<void>;
  postReport(feedId: number, postDto: PostFeedReportRequestDTO): Promise<void>;
}

@Injectable()
export class FeedServiceImpl implements FeedService {
  constructor(
    @Inject(FeedRepositoryToken)
    private readonly feedRepo: FeedRepository,
  ) {}

  async getFeeds(getDto: GetFeedsRequestDTO): Promise<GetFeedsResponseDTO[]> {
    throw new NotFoundException('미구현 API');
    // const feeds =
    //   getDto.testType === 'Polygon'
    //     ? await this.feedRepo.findByPolygon(getDto)
    //     : await this.feedRepo.findByCoordinates(getDto);

    // return Util.toInstance(GetFeedsRequestDTO, feeds);
    return;
  }

  async postFeeds(
    userId: number,
    postDto: PostFeedRequestDTO,
  ): Promise<PostFeedResponseDTO> {
    throw new NotFoundException('미구현 API');
  }

  async postImages(feedId: number, file: Express.Multer.File[]): Promise<void> {
    throw new NotFoundException('미구현 API');
  }

  async getFeed(feedId: number): Promise<GetFeedResponseDTO> {
    throw new NotFoundException('미구현 API');
  }

  async getSearch(
    getDto: GetFeedsSearchRequestDTO,
  ): Promise<GetFeedResponseDTO[]> {
    throw new NotFoundException('미구현 API');
  }

  async getComments(
    feedId: number,
    getDto: GetFeedCommentsRequestDTO,
  ): Promise<GetFeedCommentsResponseDTO[]> {
    throw new NotFoundException('미구현 API');
  }

  async postComments(
    feedId: number,
    postDto: PostFeedCommentRequestDTO,
  ): Promise<PostFeedCommentResponseDTO> {
    throw new NotFoundException('미구현 API');
  }

  async postRecommend(feedId: number): Promise<void> {
    throw new NotFoundException('미구현 API');
  }

  async postUnrecommend(feedId: number): Promise<void> {
    throw new NotFoundException('미구현 API');
  }

  async postReport(
    feedId: number,
    postDto: PostFeedReportRequestDTO,
  ): Promise<void> {
    throw new NotFoundException('미구현 API');
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Util, errorMessage } from '@app/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  AdminGetFeedsRequestDTO,
  AdminGetFeedsResponseDTO,
  AdminPatchFeedActivationRequestDTO,
} from './dto';
import { FeedRepository, FeedRepositoryToken } from './feed.repository';

export const FeedServiceToken = Symbol('FeedServiceToken');
export interface FeedService {
  getFeeds(
    getDto: AdminGetFeedsRequestDTO,
  ): Promise<AdminGetFeedsResponseDTO[]>;

  patchFeedActivation(
    feedId: number,
    patchDto: AdminPatchFeedActivationRequestDTO,
  ): Promise<void>;
}

@Injectable()
export class FeedServiceImpl implements FeedService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(FeedRepositoryToken) private readonly feedRepo: FeedRepository,
  ) {}

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

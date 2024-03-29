import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { BaseRepository } from '@app/common';
import { FeedEntity } from '@app/entity';
import { AdminFeed, AdminFeedEntityMapper } from './domain';
import { AdminGetFeedsRequestDTO, Filter, Sort } from './dto';

type AdminFeedOmitReportHistories = Omit<AdminFeed, 'reportHistories'>;

type AdminFeedWithCount = {
  feeds: AdminFeedOmitReportHistories[];
  totalCount: number;
};

export abstract class AdminFeedRepositoryPort extends BaseRepository<FeedEntity> {
  abstract findMany(
    option: AdminGetFeedsRequestDTO,
  ): Promise<AdminFeedWithCount>;
  abstract findOneByPK(feedId: number): Promise<AdminFeed | null>;
  /**
   * 좌표를 사용하여 검색후 중심좌표 기준 정렬
   * @param getDto
   */
  abstract updateProperty(
    feedId: number,
    properties: Partial<FeedEntity>,
  ): Promise<void>;
}

@Injectable()
export class AdminFeedRepository extends AdminFeedRepositoryPort {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(FeedEntity, manager);
  }

  override async findMany(
    option: AdminGetFeedsRequestDTO,
  ): Promise<AdminFeedWithCount> {
    const { page, pageSize, sort, filter } = option;
    const qb = this.createQueryBuilder('feed');
    qb.select();
    qb.leftJoin('feed.user', 'user') //
      .addSelect(['user.id', 'user.mbtiType', 'user.nickname']);

    qb.where('1 = 1');
    this.setSort(qb, sort);
    this.setFilter(qb, filter);

    if (page && pageSize) {
      qb.offset((page - 1) * pageSize).limit(pageSize);
    }
    const [feeds, totalCount] = await qb.getManyAndCount();
    return {
      feeds: AdminFeedEntityMapper.toDomain(feeds),
      totalCount,
    };
  }

  override async findOneByPK(feedId: number): Promise<AdminFeed | null> {
    const feed = await this.findOne({
      select: { user: { id: true, nickname: true, mbtiType: true } },
      where: { id: feedId },
      relations: { user: true, reportHistories: true },
    });
    return feed ? AdminFeedEntityMapper.toDomain(feed) : null;
  }

  override async updateProperty(
    feedId: number,
    properties: Partial<FeedEntity>,
  ): Promise<void> {
    await this.update(feedId, { ...properties });
  }

  private setSort(
    qb: SelectQueryBuilder<FeedEntity>,
    sort: Sort,
  ): SelectQueryBuilder<FeedEntity> {
    if (sort === Sort.ASC) return qb.orderBy('feed.id', 'ASC');
    if (sort === Sort.DESC) return qb.orderBy('feed.id', 'DESC');
    if (sort === Sort.RECOMMEND)
      return qb
        .orderBy('feed.recommendCount', 'DESC') //
        .addOrderBy('feed.id', 'DESC');
    if (sort === Sort.UNRECOMMEND)
      return qb
        .orderBy('feed.unrecommendCount', 'DESC') //
        .addOrderBy('feed.id', 'DESC');
  }

  private setFilter(
    qb: SelectQueryBuilder<FeedEntity>,
    filter: Filter,
  ): SelectQueryBuilder<FeedEntity> {
    if (filter === Filter.ALL) return;
    if (filter === Filter.REPORT) return qb.andWhere('feed.reportCount > 0');
    if (filter === Filter.ACTIVATE)
      return qb.andWhere('feed.activationAt > NOW()');
  }
}

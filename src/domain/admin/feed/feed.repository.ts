import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { CustomRepository, OffsetPaginationDTO } from '@app/common';
import { FeedEntity } from '@app/entity';
import { AdminFeed, AdminFeedEntityMapper } from './domain';

export const FeedRepositoryToken = Symbol('FeedRepositoryToken');

export interface FeedRepository extends CustomRepository<FeedEntity> {
  findMany(option: OffsetPaginationDTO): Promise<AdminFeed[]>;
  /**
   * 좌표를 사용하여 검색후 중심좌표 기준 정렬
   * @param getDto
   */
  updateProperty(
    feedId: number,
    properties: Partial<FeedEntity>,
  ): Promise<void>;
}

@Injectable()
export class FeedRepositoryImpl
  extends CustomRepository<FeedEntity>
  implements FeedRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(FeedEntity, manager);
  }

  async findMany(option: OffsetPaginationDTO): Promise<AdminFeed[]> {
    const { page, pageSize, sort } = option;
    const qb = this.createQueryBuilder('feed');
    qb.select();
    qb.innerJoin('feed.user', 'user') //
      .addSelect(['user.id', 'user.mbtiType', 'user.nickname']);
    qb.innerJoin('feed.geoMark', 'mark') //
      .addSelect(['mark.id']);
    qb.leftJoinAndSelect('feed.reportHistories', 'report'); //

    qb.orderBy('feed.id', sort);

    if (page && pageSize) {
      qb.offset((page - 1) * pageSize).limit(pageSize);
    }
    const feeds = await qb.distinct(true).getMany();
    return AdminFeedEntityMapper.toDomain(feeds);
  }

  async updateProperty(
    feedId: number,
    properties: Partial<FeedEntity>,
  ): Promise<void> {
    await this.update(feedId, { ...properties });
  }
}

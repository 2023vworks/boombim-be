import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { BaseRepository } from '@app/common';
import { RecommendHistoryEntity, RecommendType } from '@app/entity';
import { RecommendHistory, RecommendHistoryEntityMapper } from '../domain';

export abstract class RecommendHistoryRepositoryPort extends BaseRepository<RecommendHistoryEntity> {
  abstract existOne(
    userId: number,
    feedId: number,
    type: RecommendType,
  ): Promise<boolean>;

  abstract findManyByFeedId(feedId: number): Promise<RecommendHistory[]>;

  abstract createOne(
    userId: number,
    feedId: number,
    type: RecommendType,
  ): Promise<RecommendHistory>;
}

@Injectable()
export class RecommendHistoryRepository extends RecommendHistoryRepositoryPort {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(RecommendHistoryEntity, manager);
  }

  override async existOne(
    userId: number,
    feedId: number,
    type: RecommendType,
  ): Promise<boolean> {
    const qb = this.createQueryBuilder('history');
    qb.where('history.user = :userId', { userId });
    qb.andWhere('history.feed = :feedId', { feedId });
    qb.andWhere('history.type = :type', { type });
    const count = await qb.getCount();
    return !!count;
  }

  override async findManyByFeedId(feedId: number): Promise<RecommendHistory[]> {
    const recommendHistories = await this.find({
      select: { user: { id: true } },
      where: { feed: { id: feedId } },
      relations: { user: true },
    });
    return RecommendHistoryEntityMapper.toDomain(recommendHistories);
  }

  override async createOne(
    userId: number,
    feedId: number,
    type: RecommendType,
  ): Promise<RecommendHistory> {
    const recommedHistory = this.create({
      type,
      user: { id: userId },
      feed: { id: feedId },
    });
    await this.save(recommedHistory);
    return RecommendHistoryEntityMapper.toDomain(recommedHistory);
  }
}

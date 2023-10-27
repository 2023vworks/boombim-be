import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { CustomRepository } from '@app/common';
import { RecommendHistoryEntity, RecommendType } from '@app/entity';
import { RecommendHistory, RecommendHistoryEntityMapper } from '../domain';

export const RecommendHistoryRepositoryToken = Symbol(
  'RecommendHistoryRepositoryToken',
);

export interface RecommendHistoryRepository
  extends CustomRepository<RecommendHistoryEntity> {
  existOne(
    userId: number,
    feedId: number,
    type: RecommendType,
  ): Promise<boolean>;
  createOne(
    userId: number,
    feedId: number,
    type: RecommendType,
  ): Promise<RecommendHistory>;
}

@Injectable()
export class RecommendHistoryRepositoryImpl
  extends CustomRepository<RecommendHistoryEntity>
  implements RecommendHistoryRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(RecommendHistoryEntity, manager);
  }

  async existOne(
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

  async createOne(
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

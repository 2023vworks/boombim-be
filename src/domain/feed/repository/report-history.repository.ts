import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { CustomRepository } from '@app/common';
import { ReportHistoryEntity } from '@app/entity';
import { PostFeedReportRequestDTO } from '../dto';
import { ReportHistory } from '../domain';
import { ReportHistoryEntityMapper } from '../domain/mapper/report-history-entity-mapper';

export const ReportHistoryRepositoryToken = Symbol(
  'ReportHistoryRepositoryToken',
);

export interface ReportHistoryRepository
  extends CustomRepository<ReportHistoryEntity> {
  existOne(userId: number, feedId: number): Promise<boolean>;
  createOne(
    userId: number,
    feedId: number,
    postDto: PostFeedReportRequestDTO,
  ): Promise<ReportHistory>;
}

@Injectable()
export class ReportHistoryRepositoryImpl
  extends CustomRepository<ReportHistoryEntity>
  implements ReportHistoryRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(ReportHistoryEntity, manager);
  }

  async existOne(userId: number, feedId: number): Promise<boolean> {
    const qb = this.createQueryBuilder('history');
    qb.where('history.user = :userId', { userId });
    qb.andWhere('history.feed = :feedId', { feedId });
    const count = await qb.getCount();
    return !!count;
  }

  async createOne(
    userId: number,
    feedId: number,
    postDto: PostFeedReportRequestDTO,
  ): Promise<ReportHistory> {
    const reportHistory = this.create({
      ...postDto,
      user: { id: userId },
      feed: { id: feedId },
    });
    await this.save(reportHistory);
    return ReportHistoryEntityMapper.toDomain(reportHistory);
  }
}

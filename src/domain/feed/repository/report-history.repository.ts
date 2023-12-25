import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { CustomRepository } from '@app/common';
import { ReportHistoryEntity } from '@app/entity';
import { PostFeedReportRequestDTO } from '../dto';
import { ReportHistory } from '../domain';
import { ReportHistoryEntityMapper } from '../domain/mapper/report-history-entity-mapper';

export abstract class ReportHistoryRepositoryPort extends CustomRepository<ReportHistoryEntity> {
  abstract existOne(userId: number, feedId: number): Promise<boolean>;
  abstract createOne(
    userId: number,
    feedId: number,
    postDto: PostFeedReportRequestDTO,
  ): Promise<ReportHistory>;
}

@Injectable()
export class ReportHistoryRepository extends ReportHistoryRepositoryPort {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(ReportHistoryEntity, manager);
  }

  override async existOne(userId: number, feedId: number): Promise<boolean> {
    const qb = this.createQueryBuilder('history');
    qb.where('history.user = :userId', { userId });
    qb.andWhere('history.feed = :feedId', { feedId });
    const count = await qb.getCount();
    return !!count;
  }

  override async createOne(
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

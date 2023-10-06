import { Injectable } from '@nestjs/common';

import { CustomRepository } from '@app/common';
import { Feed } from './domain';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { GetFeedsRequestDTO } from './dto';
import {
  CommentEntity,
  FeedEntity,
  RecommendHistoryEntity,
  ReportHistoryEntity,
} from '@app/entity';

export const FeedRepositoryToken = Symbol('FeedRepositoryToken');
export interface FeedRepository extends CustomRepository<FeedEntity> {
  /**
   * 좌표를 사용하여 단순 검색
   * - Limit  (cost=167.56..1435.06 rows=1000 width=108) (actual time=2.328..4.116 rows=1000 loops=1)
   * @param getDto
   */
  findByCoordinates(getDto: GetFeedsRequestDTO): Promise<Feed[]>;
  /**
   * PostGIS의 Polygon을 사용하여 검색
   * - Limit  (cost=0.56..26545.45 rows=1000 width=108) (actual time=0.043..4.919 rows=1000 loops=1)
   * @param getDto
   */
  findByPolygon(getDto: GetFeedsRequestDTO): Promise<Feed[]>;
}

@Injectable()
export class FeedRepositoryImpl
  extends CustomRepository<FeedEntity>
  implements FeedRepository
{
  private readonly commentRepon: Repository<CommentEntity>;
  private readonly recommendHistoryRepon: Repository<RecommendHistoryEntity>;
  private readonly reportHistoryRepon: Repository<ReportHistoryEntity>;

  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(Feed, manager);
    this.commentRepon = manager.getRepository(CommentEntity);
    this.recommendHistoryRepon = manager.getRepository(RecommendHistoryEntity);
    this.reportHistoryRepon = manager.getRepository(ReportHistoryEntity);
  }

  async findByCoordinates(getDto: GetFeedsRequestDTO): Promise<Feed[]> {
    const { minX, minY, maxX, maxY, page, pageSize } = getDto;
    const qb = this.createQueryBuilder('feed');
    qb.select();

    qb.innerJoinAndSelect('feed.user', 'user') // TODO: 관계성을 끊을려면 역정규화 하는게 좋을거 같음
      .select(['user.mbtiType', 'user.nickname']);

    qb.innerJoin('feed.geoMark', 'mark');

    qb.where('feed."activationAt" >= now()');

    qb.andWhere('mark.x BETWEEN :minX AND :maxX', { minX, maxX });
    qb.andWhere('mark.y BETWEEN :minY AND :maxY', { minY, maxY });

    // 1순위: 추천수, 2순위: 거리, 3순위: 남은 잔여 시간이 많은 순으로
    // 중심 좌표 구하는 로직 필요
    if (page && pageSize) {
      qb.offset((page - 1) * pageSize).limit(pageSize);
    }

    // 1. 추천순
    qb.orderBy('feed.recommendCount', 'DESC');
    // 2. 거리
    // 3. 남은 잔여시간
    qb.orderBy('feed.activationAt', 'DESC');

    return;
  }

  async findByPolygon(getDto: GetFeedsRequestDTO): Promise<Feed[]> {
    return;
  }
}

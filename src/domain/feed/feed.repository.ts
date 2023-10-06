import { Injectable } from '@nestjs/common';

import { CustomRepository, DateUtil } from '@app/common';
import { Feed, FeedEntityMapper } from './domain';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { GetFeedsRequestDTO, PostFeedRequestDTO } from './dto';
import {
  CommentEntity,
  FeedEntity,
  RecommendHistoryEntity,
  ReportHistoryEntity,
} from '@app/entity';

export const FeedRepositoryToken = Symbol('FeedRepositoryToken');

/**
 * FeedRepository#findByCoordinates vs FeedRepository#findByPolygon
 * - 조회되는 데이터는 같으나 정렬방식에 차이가 발생한다.
 * - 좌표를 사용한 경우 정확한 거리데이터가 도출되지 않는다고 한다.
 * @todo 향후 테스트와 실제 지도에 표시되는 데이터를 비교해보고 더 정확한 메서드를 사용해야 한다.
 */
export interface FeedRepository extends CustomRepository<FeedEntity> {
  /**
   * 좌표를 사용하여 검색후 중심좌표 기준 정렬
   * @param getDto
   */
  findByCoordinates(getDto: GetFeedsRequestDTO): Promise<Feed[]>;
  /**
   * PostGIS의 Polygon을 사용하여 검색후 중심좌표 기준 정렬
   * - 폴리곤을 사용한 경우 더 정확한 거리데이터가 도출된다고 한다.
   * @param getDto
   */
  findByPolygon(getDto: GetFeedsRequestDTO): Promise<Feed[]>;

  findOneByGeoMarkId(geoMarkId: number): Promise<Feed | null>;
  findOneByPK(feedId: number): Promise<Feed | null>;

  createFeed(userId: number, postDto: PostFeedRequestDTO): Promise<Feed>;
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
  private readonly commentRepon: Repository<CommentEntity>;
  private readonly recommendHistoryRepon: Repository<RecommendHistoryEntity>;
  private readonly reportHistoryRepon: Repository<ReportHistoryEntity>;

  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(FeedEntity, manager);
    this.commentRepon = manager.getRepository(CommentEntity);
    this.recommendHistoryRepon = manager.getRepository(RecommendHistoryEntity);
    this.reportHistoryRepon = manager.getRepository(ReportHistoryEntity);
  }

  async findByCoordinates(getDto: GetFeedsRequestDTO): Promise<Feed[]> {
    const { minX, minY, maxX, maxY, page, pageSize } = getDto;
    const qb = this.createQueryBuilder('feed');
    const centerPoint = this.makeCenterPoint(minX, minY, maxX, maxY);

    qb.select();
    qb.innerJoin('feed.user', 'user') //
      .addSelect(['user.mbtiType', 'user.nickname']);
    qb.innerJoin('feed.geoMark', 'mark');

    qb.where('feed."activationAt" >= now()');
    qb.andWhere('mark.x BETWEEN :minX AND :maxX', { minX, maxX });
    qb.andWhere('mark.y BETWEEN :minY AND :maxY', { minY, maxY });

    if (page && pageSize) {
      qb.offset((page - 1) * pageSize).limit(pageSize);
    }
    /* 1. 추천이 많은 순 > 2. 중심좌표 기준 가까운 거리 > 3. 남은 잔여시간이 많은 순 */
    qb.orderBy('feed.recommendCount', 'DESC');
    qb.addOrderBy(`ST_Distance(mark.point, ${centerPoint})`, 'DESC');
    qb.addOrderBy('feed.activationAt', 'DESC');

    const feeds = await qb.getMany();
    return FeedEntityMapper.toDomain(feeds);
  }

  async findByPolygon(getDto: GetFeedsRequestDTO): Promise<Feed[]> {
    const { minX, minY, maxX, maxY, page, pageSize } = getDto;
    const qb = this.createQueryBuilder('feed');
    const centerPoint = this.makeCenterPoint(minX, minY, maxX, maxY);

    qb.select();
    qb.innerJoin('feed.user', 'user') //
      .addSelect(['user.mbtiType', 'user.nickname']);
    qb.innerJoin('feed.geoMark', 'mark');

    qb.where('feed."activationAt" >= now()');
    qb.andWhere(
      `ST_Contains(
          ST_MakeEnvelope(:minX, :minY, :maxX, :maxY, 4326),
          mark.point
        )`,
      { minX, minY, maxX, maxY },
    );

    if (page && pageSize) {
      qb.offset((page - 1) * pageSize).limit(pageSize);
    }
    /* 1. 추천이 많은 순 > 2. 중심좌표 기준 가까운 거리 > 3. 남은 잔여시간이 많은 순 */
    qb.orderBy('feed.recommendCount', 'DESC');
    qb.addOrderBy(`ST_Distance(mark.point, ${centerPoint})`, 'DESC');
    qb.addOrderBy('feed.activationAt', 'DESC');

    const feeds = await qb.getMany();
    return FeedEntityMapper.toDomain(feeds);
  }

  async findOneByGeoMarkId(geoMarkId: number): Promise<Feed | null> {
    const feed = await this.findOne({
      select: {
        user: { nickname: true, mbtiType: true },
      },
      where: { geoMark: { id: geoMarkId } },
      relations: this.getRelationsByFeed(),
    });

    return feed ? FeedEntityMapper.toDomain(feed) : null;
  }

  async findOneByPK(feedId: number): Promise<Feed | null> {
    const feed = await this.findOne({
      select: {
        user: { nickname: true, mbtiType: true },
      },
      where: { id: feedId },
      relations: this.getRelationsByFeed(),
    });
    return feed ? FeedEntityMapper.toDomain(feed) : null;
  }

  async createFeed(userId: number, postDto: PostFeedRequestDTO): Promise<Feed> {
    const { x, y } = postDto.geoMark;
    const feed = this.create({
      ...postDto,
      activationAt: DateUtil.addHours(6),
      geoMark: {
        ...postDto.geoMark,
        point: {
          type: 'Point',
          coordinates: [x, y],
        },
      },
      user: { id: userId },
    });
    await this.save(feed);
    return FeedEntityMapper.toDomain(feed);
  }

  async updateProperty(
    feedId: number,
    properties: Partial<FeedEntity>,
  ): Promise<void> {
    await this.update(feedId, { ...properties });
  }

  /* ======================== private ======================== */
  private makeCenterPoint(X: number, Y: number): string;
  private makeCenterPoint(
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
  ): string;
  private makeCenterPoint(
    a: number,
    b: number,
    c?: number,
    d?: number,
  ): string {
    return arguments.length === 2
      ? `ST_SetSRID(ST_MakePoint(${a}, ${b}), 4326)`
      : `ST_SetSRID(ST_MakePoint(${(a + b) / 2}, ${(c + d) / 2}), 4326)`;
  }

  private getRelationsByFeed() {
    return {
      user: true,
      comments: true,
      geoMark: {
        regionInfo: true,
        address: true,
        roadAddress: true,
      },
    };
  }
}

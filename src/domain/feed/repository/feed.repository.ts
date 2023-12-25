import { ConflictException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, MoreThanOrEqual, Repository } from 'typeorm';

import { BaseRepository, DateUtil, errorMessage } from '@app/common';
import { FeedEntity, PolygonInfoEntity, RegionType } from '@app/entity';
import { Feed, FeedEntityMapper } from '../domain';
import { GetFeedsRequestDTO, PostFeedRequestDTO } from '../dto';

export type PureFeed = Omit<Feed, 'geoMark'>;

export abstract class FeedRepositoryPort extends BaseRepository<FeedEntity> {
  /**
   * PostGIS의 Polygon을 사용하여 검색후 중심좌표 기준 정렬
   * - 폴리곤을 사용한 경우 더 정확한 거리데이터가 도출된다고 한다.
   * @param getDto
   */
  abstract findManyByPolygon(getDto: GetFeedsRequestDTO): Promise<PureFeed[]>;
  /**
   * 피드 활성화 시간에 상관없이 조회.
   * @param userId
   */
  abstract findManyByUserId(userId: number): Promise<PureFeed[]>;

  abstract existOneByUserId(feedId: number, userId: number): Promise<boolean>;
  abstract findOneByGeoMarkId(geoMarkId: number): Promise<Feed | null>;

  abstract findOneByPK(geoMarkId: number): Promise<Feed | null>;

  abstract findOnePure(feedId: number): Promise<PureFeed | null>;

  abstract createOne(
    userId: number,
    postDto: PostFeedRequestDTO,
  ): Promise<Feed | null>;
  abstract updateProperty(
    feedId: number,
    properties: Partial<FeedEntity>,
  ): Promise<void>;
  abstract softDeleteByUserId(userId: number): Promise<void>;
}

@Injectable()
export class FeedRepository extends FeedRepositoryPort {
  private readonly polygonInfoRepo: Repository<PolygonInfoEntity>;

  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(FeedEntity, manager);
    this.polygonInfoRepo = manager.getRepository(PolygonInfoEntity);
  }

  override async findManyByPolygon(
    getDto: GetFeedsRequestDTO,
  ): Promise<PureFeed[]> {
    const { centerX, centerY, dongs, page, pageSize } = getDto;
    const qb = this.createQueryBuilder('feed');
    const centerPoint = this.makeCenterPoint(centerX, centerY);

    qb.select();
    qb.innerJoin('feed.user', 'user') //
      .addSelect(['user.id', 'user.mbtiType', 'user.nickname']);
    qb.innerJoin('feed.geoMark', 'mark') //
      .addSelect(['mark.id', 'mark.region']);

    qb.where('feed."activationAt" >= now()');
    // Note: polygon_info가 가진 행정동 경계 정보를 사용, 행정동에 포함된 피드만 조회
    qb.andWhere(
      `EXISTS(
        SELECT 1 FROM polygon_info pol
        WHERE pol.dong IN (:...dongs)
        AND ST_Contains(pol."polygon", mark.point)
    )`,
      { dongs },
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

  override async findManyByUserId(userId: number): Promise<PureFeed[]> {
    const qb = this.createQueryBuilder('feed');
    qb.select();
    qb.innerJoin('feed.user', 'user') //
      .addSelect(['user.id', 'user.mbtiType', 'user.nickname']);
    qb.innerJoin('feed.geoMark', 'mark') //
      .addSelect(['mark.id', 'mark.region']);

    qb.where('feed."userId" =:userId', { userId });
    qb.orderBy('feed.id', 'DESC');

    const feeds = await qb.getMany();
    return FeedEntityMapper.toDomain(feeds);
  }

  override async existOneByUserId(
    feedId: number,
    userId: number,
  ): Promise<boolean> {
    const count = await this.createQueryBuilder('feed')
      .where('feed.id = :feedId', { feedId })
      .andWhere('feed.user = :userId', { userId })
      .getCount();
    return !!count;
  }

  override async findOneByGeoMarkId(geoMarkId: number): Promise<Feed | null> {
    const feed = await this.findOne({
      select: {
        user: { id: true, nickname: true, mbtiType: true },
      },
      where: {
        geoMark: { id: geoMarkId },
        activationAt: MoreThanOrEqual(new Date()),
      },
      relations: this.getRelationsByFeed(),
    });

    return feed ? FeedEntityMapper.toDomain(feed) : null;
  }

  override async findOneByPK(feedId: number): Promise<Feed | null> {
    const feed = await this.findOne({
      select: {
        user: { id: true, nickname: true, mbtiType: true },
      },
      where: { id: feedId, activationAt: MoreThanOrEqual(new Date()) },
      relations: this.getRelationsByFeed(),
    });
    return feed ? FeedEntityMapper.toDomain(feed) : null;
  }

  override async findOnePure(feedId: number): Promise<PureFeed | null> {
    const feed = await this.findOne({
      select: {
        user: { id: true, nickname: true, mbtiType: true },
        geoMark: { id: true, region: true },
      },
      where: { id: feedId, activationAt: MoreThanOrEqual(new Date()) },
      relations: { user: true, geoMark: true },
    });
    return feed ? FeedEntityMapper.toDomain(feed) : null;
  }

  override async createOne(
    userId: number,
    postDto: PostFeedRequestDTO,
  ): Promise<Feed> {
    const { x, y } = postDto.geoMark;

    const region = await this.findRegion(x, y);
    if (!region) throw new ConflictException(errorMessage.E409_FEED_004);

    const feed = this.create({
      ...postDto,
      activationAt: DateUtil.addHours(6),
      geoMark: {
        ...postDto.geoMark,
        region,
        regionType: RegionType.H,
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

  override async updateProperty(
    feedId: number,
    properties: Partial<FeedEntity>,
  ): Promise<void> {
    await this.update(feedId, { ...properties });
  }

  override async softDeleteByUserId(userId: number): Promise<void> {
    await this.createQueryBuilder()
      .where('feed."userId" = :userId', { userId })
      .softDelete()
      .execute();
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

  /**
   * PostGIS를 사용하여 x, y가 속하는 폴리곤(지역)을 찾는다.
   * @param x
   * @param y
   * @returns
   */
  private async findRegion(x: number, y: number): Promise<string | null> {
    const qb = this.polygonInfoRepo.createQueryBuilder('pol');
    qb.select('pol.dong');
    qb.where(`
      ST_Contains(
        pol."polygon", 
        ST_GeomFromText('POINT (${x} ${y})', 4326))
    `);
    const result = await qb.getOne();
    return result ? result.dong : null;
  }

  private getRelationsByFeed() {
    return {
      user: true,
      geoMark: {
        regionInfo: true,
        address: true,
        roadAddress: true,
      },
    };
  }
}

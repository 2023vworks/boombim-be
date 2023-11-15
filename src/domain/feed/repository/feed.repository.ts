import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, MoreThanOrEqual, Repository } from 'typeorm';

import { CustomRepository, DateUtil, OffsetPaginationDTO } from '@app/common';
import { FeedEntity, PolygonInfoEntity, RegionType } from '@app/entity';
import { Feed, FeedEntityMapper } from '../domain';
import { GetFeedsRequestDTO, PostFeedRequestDTO } from '../dto';

type FeedOmitGeomark = Omit<Feed, 'geoMark'>;

export const FeedRepositoryToken = Symbol('FeedRepositoryToken');

export interface FeedRepository extends CustomRepository<FeedEntity> {
  findMany(option: OffsetPaginationDTO): Promise<Feed[]>;
  /**
   * 좌표를 사용하여 검색후 중심좌표 기준 정렬
   * @param getDto
   */
  findByCoordinates(getDto: GetFeedsRequestDTO): Promise<FeedOmitGeomark[]>;
  /**
   * PostGIS의 Polygon을 사용하여 검색후 중심좌표 기준 정렬
   * - 폴리곤을 사용한 경우 더 정확한 거리데이터가 도출된다고 한다.
   * @param getDto
   */
  findByPolygon(getDto: GetFeedsRequestDTO): Promise<FeedOmitGeomark[]>;

  existOneByUserId(feedId: number, userId: number): Promise<boolean>;
  findOneByGeoMarkId(geoMarkId: number): Promise<Feed | null>;
  findOneByPK(geoMarkId: number): Promise<Feed | null>;
  findOnePure(feedId: number): Promise<Feed | null>;
  createOne(userId: number, postDto: PostFeedRequestDTO): Promise<Feed | null>;
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
  private readonly polygonInfoRepo: Repository<PolygonInfoEntity>;

  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(FeedEntity, manager);
    this.polygonInfoRepo = manager.getRepository(PolygonInfoEntity);
  }

  async findMany(option: OffsetPaginationDTO): Promise<Feed[]> {
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
    return FeedEntityMapper.toDomain(feeds);
  }

  async findByCoordinates(getDto: GetFeedsRequestDTO): Promise<Feed[]> {
    const { minX, minY, maxX, maxY, page, pageSize } = getDto;
    const qb = this.createQueryBuilder('feed');
    const centerPoint = this.makeCenterPoint(minX, minY, maxX, maxY);

    qb.select();
    qb.innerJoin('feed.user', 'user') //
      .addSelect(['user.id', 'user.mbtiType', 'user.nickname']);
    qb.innerJoin('feed.geoMark', 'mark') //
      .addSelect(['mark.id', 'mark.region']);

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
      .addSelect(['user.id', 'user.mbtiType', 'user.nickname']);
    qb.innerJoin('feed.geoMark', 'mark') //
      .addSelect(['mark.id', 'mark.region']);

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

  async existOneByUserId(feedId: number, userId: number): Promise<boolean> {
    const count = await this.createQueryBuilder('feed')
      .where('feed.id = :feedId', { feedId })
      .andWhere('feed.user = :userId', { userId })
      .getCount();
    return !!count;
  }

  async findOneByGeoMarkId(geoMarkId: number): Promise<Feed | null> {
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

  async findOneByPK(feedId: number): Promise<Feed | null> {
    const feed = await this.findOne({
      select: {
        user: { id: true, nickname: true, mbtiType: true },
      },
      where: { id: feedId, activationAt: MoreThanOrEqual(new Date()) },
      relations: this.getRelationsByFeed(),
    });
    return feed ? FeedEntityMapper.toDomain(feed) : null;
  }

  async findOnePure(feedId: number): Promise<Feed | null> {
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

  async createOne(userId: number, postDto: PostFeedRequestDTO): Promise<Feed> {
    const { x, y } = postDto.geoMark;

    const feed = this.create({
      ...postDto,
      activationAt: DateUtil.addHours(6),
      geoMark: {
        ...postDto.geoMark,
        region: await this.getRegion(x, y),
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

  /**
   * PostGIS를 사용하여 x, y가 속하는 폴리곤(지역)을 찾는다.
   * @param x
   * @param y
   * @returns
   */
  async getRegion(x: number, y: number) {
    const qb = this.polygonInfoRepo.createQueryBuilder('pol');
    qb.select('pol.dong');
    qb.where(`
      ST_Contains(
        pol."polygon", 
        ST_GeomFromText('POINT (${x} ${y})', 4326))
    `);
    const { dong } = await qb.getOne();
    return dong;
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
